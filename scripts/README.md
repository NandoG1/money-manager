# Fintrack Database Migration Scripts

This directory contains scripts for migrating data in the Fintrack application.

## Quiz Progress Migration

If users are experiencing issues where all accounts show the same quiz progress, you need to run the migration script to update the database schema. The script will:

1. Add a `userId` field to all quiz progress records
2. Update the `user` field to be an ObjectId reference when possible
3. Ensure each user has their own unique quiz progress

### Prerequisites

- Node.js installed
- MongoDB connection string in your `.env` file

### Running the Migration

```bash
# Navigate to the project root directory
cd fintrack

# Run the migration script
node scripts/migrate-quiz-progress.js
```

### Expected Output

The script will show progress information:

```
Connected to MongoDB
Found X quiz progress records to migrate
Migrating progress for user: user1@example.com
Found user with ObjectId abc123 for email user1@example.com
Progress for user user1@example.com updated successfully
...
Migration completed
Script completed successfully
```

### After Migration

After running the migration:

- Each user will have their own quiz progress
- The database schema will be compatible with the updated code
- Previous quiz progress data will be preserved

If you continue to experience issues, restart the application server after the migration completes.

## Quiz User Isolation Test

To verify that the quiz progress is properly isolated between different users, you can run the test script:

```bash
# Navigate to the project root directory
cd fintrack

# Run the test script
node scripts/test-quiz-users.js
```

This script will:

1. Create two test users with different quiz progress
2. Verify that each user has their own separate data
3. Clean up the test users when done

If the test passes, you'll see success messages indicating that users have different progress data.

This is useful to confirm that the schema changes and migration script have successfully fixed the issue where all users shared the same quiz progress.
