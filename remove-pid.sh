#!/bin/bash
cwd=$(pwd)
pid_file="${cwd}/tmp/pids/server.pid"
cat "${pid_file}"

if [ $? -eq 0 ]; then
    # Assuming the process ID is stored in the server.pid file
    pid=$(cat "${pid_file}")
    # Send the kill signal to the process
    kill -9 ${pid}
    echo "Process with PID ${pid} killed."
else
    echo "Failed to read or find the PID file."
fi