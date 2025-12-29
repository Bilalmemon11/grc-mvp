import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Starting database seed...');

  // Create permissions
  console.log('Creating permissions...');
  const permissions = [
    { name: 'users:read', resource: 'users', action: 'read', description: 'Read users' },
    { name: 'users:create', resource: 'users', action: 'create', description: 'Create users' },
    { name: 'users:update', resource: 'users', action: 'update', description: 'Update users' },
    { name: 'users:delete', resource: 'users', action: 'delete', description: 'Delete users' },
    {
      name: 'frameworks:read',
      resource: 'frameworks',
      action: 'read',
      description: 'Read frameworks',
    },
    {
      name: 'frameworks:create',
      resource: 'frameworks',
      action: 'create',
      description: 'Create frameworks',
    },
    {
      name: 'risks:read',
      resource: 'risks',
      action: 'read',
      description: 'Read risks',
    },
    {
      name: 'risks:create',
      resource: 'risks',
      action: 'create',
      description: 'Create risks',
    },
    {
      name: 'audits:read',
      resource: 'audits',
      action: 'read',
      description: 'Read audits',
    },
    {
      name: 'audits:create',
      resource: 'audits',
      action: 'create',
      description: 'Create audits',
    },
  ];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: {},
      create: permission,
    });
  }

  // Create roles
  console.log('Creating roles...');
  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: {
      name: 'Admin',
      description: 'Full system access',
    },
  });

  await prisma.role.upsert({
    where: { name: 'Compliance Manager' },
    update: {},
    create: {
      name: 'Compliance Manager',
      description: 'Manage compliance and controls',
    },
  });

  await prisma.role.upsert({
    where: { name: 'Risk Manager' },
    update: {},
    create: {
      name: 'Risk Manager',
      description: 'Manage risks and mitigations',
    },
  });

  await prisma.role.upsert({
    where: { name: 'Auditor' },
    update: {},
    create: {
      name: 'Auditor',
      description: 'Conduct audits and manage findings',
    },
  });

  await prisma.role.upsert({
    where: { name: 'Viewer' },
    update: {},
    create: {
      name: 'Viewer',
      description: 'Read-only access',
    },
  });

  // Assign permissions to Admin role
  const allPermissions = await prisma.permission.findMany();
  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });
  }

  // Create organization
  console.log('Creating organization...');
  const organization = await prisma.organization.upsert({
    where: { domain: 'demo.grc.local' },
    update: {},
    create: {
      name: 'Demo Organization',
      domain: 'demo.grc.local',
      isActive: true,
    },
  });

  // Create admin user
  console.log('Creating admin user...');
  const hashedPassword = await bcrypt.hash('Admin@123', 12);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@demo.grc.local' },
    update: {},
    create: {
      email: 'admin@demo.grc.local',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      isActive: true,
    },
  });

  // Assign admin role to admin user
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  });

  // Link user to organization
  await prisma.organizationUser.upsert({
    where: {
      organizationId_userId: {
        organizationId: organization.id,
        userId: adminUser.id,
      },
    },
    update: {},
    create: {
      organizationId: organization.id,
      userId: adminUser.id,
    },
  });

  // Create risk categories
  console.log('Creating risk categories...');
  const riskCategories = [
    { name: 'Strategic', description: 'Strategic and business risks' },
    { name: 'Operational', description: 'Operational process risks' },
    { name: 'Financial', description: 'Financial and economic risks' },
    { name: 'Compliance', description: 'Regulatory and compliance risks' },
    { name: 'Technical', description: 'Technology and cybersecurity risks' },
    { name: 'Reputational', description: 'Brand and reputation risks' },
  ];

  for (const category of riskCategories) {
    await prisma.riskCategory.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log('✅ Database seed completed successfully!');
  console.log('');
  console.log('📧 Admin credentials:');
  console.log('   Email: admin@demo.grc.local');
  console.log('   Password: Admin@123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
