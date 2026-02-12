import subprocess
import os

def run_command(command):
    try:
        # We need to run from the context of where the script is (backend), but target root (..)
        # So we prepend git -C .. to git commands
        # Wait, if command is "git -C .. add .", it works.
        subprocess.run(command, check=True, shell=True, text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {command}")
        print(e.stderr)

print("Staging all files...")
run_command("git -C .. add .")

print("Getting file list...")
result = subprocess.run("git -C .. status --porcelain", shell=True, text=True, stdout=subprocess.PIPE)
lines = result.stdout.splitlines()

# Example line: "A  backend/package.json"
# We need the path at the end.
files = []
for line in lines:
    parts = line.strip().split()
    if len(parts) >= 2:
        files.append(parts[-1])

print(f"Found {len(files)} files to commit.")

files_processed = 0

for file_path in files:
    # file_path is relative to root, e.g. "backend/package.json"
    
    # Check if directory (shouldn't be if staged, but safe check)
    # To check existence, we need path relative to backend: "../" + file_path
    local_path = os.path.join("..", file_path)
    if os.path.isdir(local_path):
        continue
        
    print(f"Committing {file_path}...")
    
    # Commit purely the file (it is already staged)
    # Use basename for message
    filename = os.path.basename(file_path)
    message = f"Update {filename}"
    
    try:
        # git commit <file> will verify the file matches index, etc.
        # Since we staged it, it should work.
        subprocess.run(f'git -C .. commit -m "{message}" "{file_path}"', check=True, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        files_processed += 1
    except subprocess.CalledProcessError as e:
        print(f"Failed to commit {file_path}")
        print(e.stderr)

print(f"Done. Committed {files_processed} files.")
