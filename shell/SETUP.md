# Nitrokit Setup Guide

This guide will help you set up Nitrokit as a global command-line tool that you can run from anywhere on your system.

## 🚀 Quick Setup (Recommended)

Run this single command in your project root:

```bash
chmod +x shell/nitrokit.sh && sudo ln -sf "$(pwd)/shell/nitrokit.sh" /usr/local/bin/nitrokit
```

Test the installation:

```bash
nitrokit --help
nitrokit --version
```

## 📋 Setup Methods

### Method 1: Global System Binary (Recommended)

This method creates a system-wide command accessible from anywhere:

```bash
# 1. Make script executable
chmod +x shell/nitrokit.sh

# 2. Create symlink in system PATH
sudo ln -sf "$(pwd)/shell/nitrokit.sh" /usr/local/bin/nitrokit

# 3. Verify installation
which nitrokit
nitrokit --version
```

**Pros:** Works from any directory, clean command name  
**Cons:** Requires sudo access

---

### Method 2: User Local Binary

This method installs Nitrokit for the current user only:

```bash
# 1. Create local bin directory
mkdir -p ~/.local/bin

# 2. Copy script to local bin
cp shell/nitrokit.sh ~/.local/bin/nitrokit
chmod +x ~/.local/bin/nitrokit

# 3. Add to PATH (choose your shell)
# For Bash:
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# For Zsh:
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# For Fish:
set -U fish_user_paths $HOME/.local/bin $fish_user_paths

# 4. Verify installation
nitrokit --version
```

**Pros:** No sudo required, user-specific installation  
**Cons:** Need to modify shell configuration

---

### Method 3: Shell Alias

This method creates an alias that points to your project:

```bash
# Add alias to your shell configuration
# For Bash:
echo "alias nitrokit='bash $(pwd)/shell/nitrokit.sh'" >> ~/.bashrc
echo "alias nk='bash $(pwd)/shell/nitrokit.sh'" >> ~/.bashrc
source ~/.bashrc

# For Zsh:
echo "alias nitrokit='bash $(pwd)/shell/nitrokit.sh'" >> ~/.zshrc
echo "alias nk='bash $(pwd)/shell/nitrokit.sh'" >> ~/.zshrc
source ~/.zshrc

# Test the alias
nitrokit --help
nk status
```

**Pros:** Quick setup, no file copying  
**Cons:** Only works from project directory context

---

### Method 4: NPM Script Integration

Add Nitrokit commands to your `package.json`:

```json
{
    "scripts": {
        "nitrokit": "bash ./shell/nitrokit.sh",
        "nk": "bash ./shell/nitrokit.sh",
        "dev-setup": "bash ./shell/nitrokit.sh dev",
        "quality": "bash ./shell/nitrokit.sh quality",
        "translate": "bash ./shell/nitrokit.sh translate",
        "status": "bash ./shell/nitrokit.sh status"
    }
}
```

Usage:

```bash
npm run nitrokit -- --help
npm run nk -- status
npm run quality -- --fix
npm run dev-setup
```

**Pros:** Integrates with existing NPM workflow  
**Cons:** Requires `npm run` prefix

## 🔧 Verification

After installation, verify Nitrokit is working:

```bash
# Check if command is available
which nitrokit

# Show version
nitrokit --version

# Show help
nitrokit --help

# Test interactive mode
nitrokit --interactive

# Test a simple command
nitrokit status
```

## 🛠️ Troubleshooting

### Command Not Found

If you get `command not found` error:

1. **Check if script is executable:**

    ```bash
    ls -la shell/nitrokit.sh
    # Should show: -rwxr-xr-x
    ```

2. **Check PATH:**

    ```bash
    echo $PATH
    # Should include /usr/local/bin or ~/.local/bin
    ```

3. **Reload shell configuration:**

    ```bash
    source ~/.bashrc  # or ~/.zshrc
    ```

### Permission Denied

If you get permission errors:

```bash
# Fix script permissions
chmod +x shell/nitrokit.sh

# For system-wide installation, use sudo
sudo ln -sf "$(pwd)/shell/nitrokit.sh" /usr/local/bin/nitrokit
```

### Symlink Issues

If symlink is broken:

```bash
# Remove old symlink
sudo rm /usr/local/bin/nitrokit

# Create new symlink with absolute path
sudo ln -sf "$(pwd)/shell/nitrokit.sh" /usr/local/bin/nitrokit
```

## 🚮 Uninstallation

To remove Nitrokit:

### Method 1 (Global)

```bash
sudo rm /usr/local/bin/nitrokit
```

### Method 2 (Local)

```bash
rm ~/.local/bin/nitrokit
# Remove PATH modification from ~/.bashrc or ~/.zshrc
```

### Method 3 (Alias)

```bash
# Remove alias lines from ~/.bashrc or ~/.zshrc
# Then reload: source ~/.bashrc
```

### Method 4 (NPM)

```bash
# Remove scripts from package.json
```

## 📝 Usage Examples

After successful installation:

```bash
# Development setup
nitrokit dev

# Code quality analysis
nitrokit quality --fix --verbose

# Translation management
nitrokit translate --ai

# Project status
nitrokit status

# Interactive mode
nitrokit --interactive

# Help for specific command
nitrokit quality --help

# Clean project
nitrokit clean

# Diagnose issues
nitrokit doctor
```

## 🎯 Recommended Workflow

1. **Initial Setup:** Use Method 1 (Global System Binary) for the best experience
2. **Team Setup:** Document the chosen method in your project README
3. **CI/CD:** Use Method 4 (NPM Scripts) for automated environments
4. **Development:** Use `nitrokit --interactive` for guided operations

## 🔄 Updating Nitrokit

To update Nitrokit after changes:

```bash
# For global installation (Method 1)
sudo ln -sf "$(pwd)/shell/nitrokit.sh" /usr/local/bin/nitrokit

# For local installation (Method 2)
cp shell/nitrokit.sh ~/.local/bin/nitrokit

# For aliases (Method 3) - no action needed
# For NPM scripts (Method 4) - no action needed
```

---

**💡 Tip:** You can use multiple methods simultaneously. For example, set up global access for daily use and NPM scripts for CI/CD pipelines.
