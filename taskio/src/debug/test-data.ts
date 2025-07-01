import { databaseService } from '../firebase/database';

// Test function to create sample data
export async function createTestData() {
  try {
    console.log('Creating test data...');
    
    // Create a test task assigned to a specific user ID
    // You'll need to replace 'TEST_USER_ID' with an actual user ID from your auth
    const testTask = await databaseService.addTask({
      title: 'Test Task for Child',
      description: 'This is a test task assigned to a child user',
      completed: false,
      assignedTo: 'TEST_USER_ID', // Replace with actual child user ID
      createdBy: 'TEST_PARENT_ID', // Replace with actual parent user ID
      points: 15,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    });
    
    console.log('Test task created:', testTask);
    
    // You can also create more test data here
    return testTask;
  } catch (error) {
    console.error('Error creating test data:', error);
    throw error;
  }
}

// Function to list all tasks in the database (for debugging)
export async function listAllTasks() {
  try {
    // We'll implement this using the Firestore SDK directly
    console.log('This function needs to be implemented to list all tasks');
  } catch (error) {
    console.error('Error listing tasks:', error);
  }
}
