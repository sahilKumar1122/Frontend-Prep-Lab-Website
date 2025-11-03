import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function wakeDatabase() {
  console.log('🔄 Attempting to wake up database...\n');
  
  try {
    // Simple query to wake the database
    const result = await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database is awake and responding!');
    console.log('Connection successful:', result);
    
    // Test a real query
    const count = await prisma.question.count();
    console.log(`\n📊 Found ${count} questions in database`);
    
  } catch (error: any) {
    console.error('❌ Database connection failed:');
    console.error(error.message);
    
    if (error.message.includes("Can't reach database")) {
      console.log('\n💡 Solutions:');
      console.log('1. Go to https://supabase.com/dashboard');
      console.log('2. Select your project');
      console.log('3. The database will wake up automatically');
      console.log('4. Wait 30 seconds, then try again');
    }
  } finally {
    await prisma.$disconnect();
  }
}

wakeDatabase();

