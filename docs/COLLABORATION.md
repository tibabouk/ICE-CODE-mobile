# Collaboration Guide for ICE-CODE-mobile

This guide explains how to invite collaborators, including GitHub Copilot, to work on the ICE-CODE-mobile repository.

## Inviting Collaborators to the Repository

### Method 1: Via GitHub Web Interface

1. **Navigate to Repository Settings**
   - Go to your repository: `https://github.com/tibabouk/ICE-CODE-mobile`
   - Click the **"Settings"** tab (you must be the repository owner or have admin access)

2. **Access Collaborators Settings**
   - In the left sidebar, click **"Collaborators and teams"**
   - You may need to enter your GitHub password to confirm access

3. **Invite a Collaborator**
   - Click the **"Add people"** button
   - Enter the GitHub username or email address of the person you want to invite
   - For GitHub Copilot specifically, you would invite the GitHub user who will be using Copilot

4. **Set Permission Level**
   - **Read**: Can view and clone the repository
   - **Triage**: Can read and manage issues and pull requests
   - **Write**: Can read, clone, and push to the repository
   - **Maintain**: Can manage the repository without access to sensitive actions
   - **Admin**: Full access to the repository

5. **Send Invitation**
   - Click **"Add [username] to this repository"**
   - The invited user will receive an email notification and can accept the invitation

### Method 2: Via GitHub CLI (if available)

```bash
# Invite a collaborator with write access
gh api repos/tibabouk/ICE-CODE-mobile/collaborators/USERNAME \
  --method PUT \
  --field permission=push

# Invite with specific permission levels
gh api repos/tibabouk/ICE-CODE-mobile/collaborators/USERNAME \
  --method PUT \
  --field permission=admin  # or read, triage, write, maintain
```

## GitHub Copilot Integration

### For Individual Users

GitHub Copilot is tied to individual user accounts, not repositories. To enable Copilot collaboration:

1. **Each collaborator needs their own Copilot subscription**
   - Individual plan: $10/month
   - Business plan: $19/user/month
   - Available for students and open source maintainers for free

2. **Enable Copilot in your IDE**
   - Install the GitHub Copilot extension in VS Code, JetBrains IDEs, or other supported editors
   - Sign in with your GitHub account that has Copilot access

3. **Repository-specific Settings**
   - Copilot will automatically work with any repository the user has access to
   - No additional repository configuration needed

### For Organizations (Business Plan)

If you want to manage Copilot access at the organization level:

1. **Organization Settings**
   - Go to your organization settings
   - Navigate to **"Copilot"** in the left sidebar
   - Configure policies for repository access

2. **Seat Management**
   - Assign Copilot seats to organization members
   - Set policies for repository access (allow all, block all, or selected repositories)

## Setting Up Development Environment for Collaborators

### Prerequisites for New Contributors

1. **Development Environment**
   ```bash
   # Node.js (v16+ recommended)
   node --version
   npm --version
   
   # React Native CLI
   npm install -g react-native-cli
   
   # For iOS development (macOS only)
   # Install Xcode from App Store
   
   # For Android development
   # Install Android Studio and Android SDK
   ```

2. **Clone and Setup**
   ```bash
   # Clone the repository
   git clone https://github.com/tibabouk/ICE-CODE-mobile.git
   cd ICE-CODE-mobile
   
   # Install dependencies
   npm install
   # or
   yarn install
   
   # Install additional NFC dependency
   npm i react-native-nfc-manager
   ```

### IDE Setup with Copilot

1. **VS Code Setup**
   ```bash
   # Install recommended extensions
   code --install-extension GitHub.copilot
   code --install-extension GitHub.copilot-chat
   code --install-extension ms-vscode.vscode-typescript-next
   code --install-extension ms-react-native.vscode-react-native
   ```

2. **Project Configuration**
   - Create `.vscode/settings.json` with project-specific settings
   - Configure TypeScript and React Native development environment

## Collaboration Workflow

### Recommended Git Workflow

1. **Feature Branches**
   ```bash
   # Create feature branch
   git checkout -b feature/your-feature-name
   
   # Make changes and commit
   git add .
   git commit -m "feat: add your feature description"
   
   # Push to remote
   git push origin feature/your-feature-name
   ```

2. **Pull Request Process**
   - Create pull request from feature branch to main
   - Request reviews from other collaborators
   - Use GitHub's review features for code discussion
   - Merge only after approval and CI checks pass

### Code Review with Copilot

1. **Using Copilot for Reviews**
   - Use GitHub Copilot Chat to explain code changes
   - Ask Copilot to suggest improvements or identify potential issues
   - Generate documentation for new features

2. **Best Practices**
   - Review Copilot suggestions before committing
   - Ensure generated code follows project conventions
   - Test all Copilot-generated code thoroughly

## Project-Specific Guidelines

### ICE-CODE-mobile Development

1. **Key Areas for Collaboration**
   - NFC functionality (`src/services/ndef.ts`)
   - UI components (`src/screens/EncodeScreen.tsx`)
   - Mobile platform integration (Android/iOS)
   - API integration (`docs/api-sidecar.md`)

2. **Development Focus Areas**
   - React Native and TypeScript expertise
   - NFC technology understanding
   - Mobile app deployment (Play Store, App Store)
   - Emergency contact management systems

3. **Testing Requirements**
   - NFC functionality requires physical device testing
   - Test on both Android and iOS platforms
   - Validate JSON export compatibility with NFC Writer

## Managing Repository Access

### Regular Maintenance

1. **Review Collaborators Periodically**
   - Remove inactive collaborators
   - Update permission levels as needed
   - Monitor repository access logs

2. **Security Best Practices**
   - Use branch protection rules
   - Require status checks before merging
   - Enable security alerts and dependency scanning

### Emergency Access Management

1. **Backup Admin Access**
   - Ensure multiple users have admin access
   - Consider organization ownership for long-term projects

2. **Access Recovery**
   - Document recovery procedures
   - Maintain contact information for all admins

## Troubleshooting Common Issues

### Invitation Issues

1. **Invitation not received**
   - Check spam/junk email folders
   - Verify the correct email address was used
   - Try inviting by GitHub username instead

2. **Permission Denied Errors**
   - Verify collaborator has accepted the invitation
   - Check permission levels are appropriate for the task
   - Ensure two-factor authentication is properly configured

### Copilot Issues

1. **Copilot not working**
   - Verify active Copilot subscription
   - Check IDE extension is installed and updated
   - Restart IDE and re-authenticate with GitHub

2. **Repository Access Issues**
   - Ensure user has repository access
   - Check organization Copilot policies if applicable
   - Verify repository is not in blocked list

## Additional Resources

- [GitHub Docs: Managing Repository Collaborators](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/managing-teams-and-people-with-access-to-your-repository)
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [React Native Development Setup](https://reactnative.dev/docs/environment-setup)
- [NFC Development Resources](https://developer.android.com/guide/topics/connectivity/nfc)