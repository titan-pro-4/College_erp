// Test Supabase Connection
import { supabase, isSupabaseConfigured } from './src/lib/supabase.ts';

async function testConnection() {
  console.log('🔍 Checking Supabase configuration...');
  
  if (!isSupabaseConfigured()) {
    console.error('❌ Supabase is not configured properly');
    return;
  }
  
  console.log('✅ Supabase credentials found');
  console.log('🔗 Testing connection...');
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('users').select('count');
    
    if (error) {
      console.error('❌ Connection error:', error.message);
      console.log('\n📝 Please run the SQL schema in Supabase SQL Editor:');
      console.log('   1. Go to SQL Editor in Supabase Dashboard');
      console.log('   2. Copy content from supabase-schema.sql');
      console.log('   3. Paste and run the query\n');
      return;
    }
    
    console.log('✅ Successfully connected to Supabase!');
    
    // Check tables
    const tables = ['users', 'students', 'admissions', 'fee_payments', 'hostel_rooms', 'exams'];
    console.log('\n📊 Checking database tables:');
    
    for (const table of tables) {
      const { error: tableError } = await supabase.from(table).select('count').limit(1);
      if (tableError) {
        console.log(`   ❌ ${table} - Not found or no access`);
      } else {
        console.log(`   ✅ ${table} - Ready`);
      }
    }
    
    console.log('\n🎉 Supabase is ready to use!\n');
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

testConnection();
