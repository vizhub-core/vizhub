# #!/bin/bash
# # This script runs the migration script over and over.
# # This is done so that the database connection is not lost.
# while true; do
#   npm run migrate
#   sleep 5  # Waits for 5 seconds before next run
# done

#!/bin/bash
# This script runs the migration script over and over.
# The loop stops if the migration script returns a nonzero exit code.

while true; do
  npm run migrate

  # Capture the exit code of the npm command
  exit_code=$?

  # Check if the exit code is nonzero (indicating an error)
  if [ $exit_code -ne 0 ]; then
    echo "Migration script failed with exit code $exit_code. Exiting loop."
    break
  fi

  sleep 5  # Waits for 5 seconds before next run
done
