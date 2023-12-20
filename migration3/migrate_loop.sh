#!/bin/bash
# This script runs the migration script over and over.
# This is done so that the database connection is not lost.
while true; do
  npm run migrate
  sleep 5  # Waits for 5 seconds before next run
done
