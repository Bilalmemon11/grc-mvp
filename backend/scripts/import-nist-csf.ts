import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';
import * as path from 'path';

const prisma = new PrismaClient();

interface CSFControl {
  function: string;
  category: string;
  subcategory: string;
  implementationExamples: string;
  informativeReferences: string;
}

async function importNISTCSF() {
  try {
    console.log('Starting NIST CSF 2.0 import...\n');

    // Read the Excel file
    const filePath = path.join(__dirname, '../../info/csf2.xlsx');
    const workbook = XLSX.readFile(filePath);
    const sheetName = 'CSF 2.0';
    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
      throw new Error(`Sheet "${sheetName}" not found in the Excel file`);
    }

    // Convert sheet to JSON
    const rawData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Parse the data
    const controls: CSFControl[] = [];
    let currentFunction = '';
    let currentCategory = '';

    for (let i = 2; i < rawData.length; i++) {
      const row = rawData[i];

      if (!row || row.length === 0) continue;

      const functionCol = row[0];
      const categoryCol = row[1];
      const subcategoryCol = row[2];
      const implementationCol = row[3];
      const referencesCol = row[4];

      // Update current function if present
      if (functionCol && typeof functionCol === 'string' && functionCol.trim()) {
        currentFunction = functionCol.trim();
      }

      // Update current category if present
      if (categoryCol && typeof categoryCol === 'string' && categoryCol.trim()) {
        currentCategory = categoryCol.trim();
      }

      // If we have a subcategory, it's a control
      if (subcategoryCol && typeof subcategoryCol === 'string' && subcategoryCol.trim()) {
        const subcategory = subcategoryCol.trim();

        // Extract control ID (e.g., "GV.OC-01")
        const match = subcategory.match(/^([A-Z]{2}\.[A-Z]{2}-\d+):/);
        if (match) {
          controls.push({
            function: currentFunction,
            category: currentCategory,
            subcategory: subcategory,
            implementationExamples: implementationCol || '',
            informativeReferences: referencesCol || '',
          });
        }
      }
    }

    console.log(`Parsed ${controls.length} controls from Excel file\n`);

    // Get or create the default organization
    let organization = await prisma.organization.findFirst({
      where: { name: 'Demo Organization' },
    });

    if (!organization) {
      organization = await prisma.organization.create({
        data: {
          name: 'Demo Organization',
        },
      });
      console.log(`Created organization: ${organization.name}\n`);
    } else {
      console.log(`Using existing organization: ${organization.name}\n`);
    }

    // Check if framework already exists
    let framework = await prisma.framework.findFirst({
      where: {
        organizationId: organization.id,
        name: 'NIST Cybersecurity Framework',
        version: '2.0',
      },
    });

    if (framework) {
      console.log('NIST CSF 2.0 framework already exists. Deleting existing controls...\n');
      await prisma.control.deleteMany({
        where: { frameworkId: framework.id },
      });
      console.log('Existing controls deleted.\n');
    } else {
      // Create the framework
      framework = await prisma.framework.create({
        data: {
          organizationId: organization.id,
          name: 'NIST Cybersecurity Framework',
          version: '2.0',
          description: 'The NIST Cybersecurity Framework (CSF) 2.0 provides a taxonomy of high-level cybersecurity outcomes that can be used by any organization to better understand, assess, prioritize, and communicate its cybersecurity efforts.',
          isActive: true,
        },
      });
      console.log(`Created framework: ${framework.name} ${framework.version}\n`);
    }

    // Import controls
    console.log('Importing controls...\n');
    let importedCount = 0;
    const batchSize = 50;

    for (let i = 0; i < controls.length; i += batchSize) {
      const batch = controls.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (ctrl) => {
          // Extract control ID from subcategory
          const match = ctrl.subcategory.match(/^([A-Z]{2}\.[A-Z]{2}-\d+):\s*(.+)/);
          if (!match || !match[1] || !match[2]) return;

          const controlId: string = match[1];
          const title: string = match[2];

          // Extract category name (before the colon)
          const categoryMatch = ctrl.category.match(/^([^:]+):\s*(.+)/);
          const categoryId = categoryMatch ? categoryMatch[1] : '';
          const categoryDescription = categoryMatch ? categoryMatch[2] : ctrl.category;

          // Build description from function, category, and implementation examples
          let description = `**Function:** ${ctrl.function}\n\n`;
          description += `**Category:** ${categoryId} - ${categoryDescription}\n\n`;

          if (ctrl.implementationExamples) {
            description += `**Implementation Examples:**\n${ctrl.implementationExamples}\n\n`;
          }

          // Build guidance from informative references
          let guidance = '';
          if (ctrl.informativeReferences) {
            guidance = `**Informative References:**\n${ctrl.informativeReferences}`;
          }

          try {
            if (!organization || !framework) {
              throw new Error('Organization or framework not found');
            }

            await prisma.control.create({
              data: {
                organizationId: organization!.id,
                frameworkId: framework!.id,
                controlId: controlId,
                title: title,
                description: description.trim(),
                guidance: guidance.trim() || null,
                status: 'NOT_STARTED',
              },
            });
            importedCount++;
          } catch (error: any) {
            console.error(`Error importing control ${controlId}:`, error.message);
          }
        })
      );

      console.log(`Imported ${Math.min(i + batchSize, controls.length)}/${controls.length} controls...`);
    }

    console.log(`\n✅ Successfully imported ${importedCount} controls!`);
    console.log(`\nFramework Details:`);
    console.log(`- ID: ${framework.id}`);
    console.log(`- Name: ${framework.name}`);
    console.log(`- Version: ${framework.version}`);
    console.log(`- Organization: ${organization.name}`);
    console.log(`- Total Controls: ${importedCount}`);

  } catch (error) {
    console.error('Error importing NIST CSF 2.0:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
importNISTCSF()
  .then(() => {
    console.log('\n🎉 Import completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Import failed:', error);
    process.exit(1);
  });
