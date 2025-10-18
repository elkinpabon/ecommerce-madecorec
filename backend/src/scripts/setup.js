const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
      }
      console.log(stdout);
      resolve(stdout);
    });
  });
};

const createEnvFile = () => {
  const envTemplate = `# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ecommerce_madecorec
DB_USER=root
DB_PASSWORD=

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# PayPhone Configuration
PAYPHONE_API_URL=https://pay.payphoneapp.com/api/v1
PAYPHONE_STORE_ID=your-store-id
PAYPHONE_CLIENT_SECRET=your-client-secret
PAYPHONE_WEBHOOK_URL=http://localhost:5000/api/payments/webhook/payphone
PAYPHONE_ENVIRONMENT=sandbox

# Frontend URL
CLIENT_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=10mb

# Email Configuration (optional)
EMAIL_HOST=
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_FROM=noreply@madecorec.com
`;

  const envPath = path.join(__dirname, '../../.env');
  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, envTemplate);
    console.log('✅ .env file created');
  } else {
    console.log('ℹ️  .env file already exists');
  }
};

const setup = async () => {
  try {
    console.log('🚀 Starting setup process...\n');

    // Create .env file if not exists
    createEnvFile();

    // Install dependencies
    console.log('📦 Installing dependencies...');
    await runCommand('npm install');

    // Run migrations
    console.log('\n🗃️  Running database migrations...');
    await runCommand('npx sequelize-cli db:migrate');

    // Run seeders
    console.log('\n🌱 Running database seeders...');
    await runCommand('npx sequelize-cli db:seed:all');

    console.log('\n✅ Setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Update your .env file with your database credentials');
    console.log('2. Update PayPhone configuration in .env');
    console.log('3. Run: npm run dev');
    console.log('\n🎉 Your e-commerce backend is ready!');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
};

setup();