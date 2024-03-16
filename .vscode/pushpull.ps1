# Define the command to run
$command = "git pull"

# Infinite loop to run the command every 5 minutes
while ($true) {
    # Execute the command
    Invoke-Expression $command
    # Wait for 5 minutes (300 seconds)
    Start-Sleep -Seconds 300
}
