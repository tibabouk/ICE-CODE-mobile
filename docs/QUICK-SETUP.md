# Quick Setup: Inviting GitHub Copilot Users

This is a quick reference for repository owners who want to invite GitHub Copilot users to collaborate.

## Step-by-Step: Invite a Copilot User

### 1. Add Collaborator to Repository

**Via GitHub Web Interface:**
1. Go to https://github.com/tibabouk/ICE-CODE-mobile
2. Click **Settings** tab
3. Click **Collaborators and teams** in sidebar
4. Click **Add people** button
5. Enter the GitHub username of the Copilot user
6. Select permission level (usually **Write** for developers)
7. Click **Add [username] to this repository**

**Recommended Permissions:**
- **Write**: For regular contributors (can push code)
- **Maintain**: For trusted contributors (can manage issues/PRs)
- **Admin**: For co-maintainers (full repository access)

### 2. Copilot User Setup

The invited user needs to:

1. **Accept the invitation** (via email or GitHub notifications)
2. **Have GitHub Copilot subscription** 
   - Individual: $10/month
   - Business: $19/user/month
   - Free for students/OSS maintainers
3. **Install Copilot in their IDE:**
   ```bash
   # VS Code
   code --install-extension GitHub.copilot
   code --install-extension GitHub.copilot-chat
   ```
4. **Clone and setup repository:**
   ```bash
   git clone https://github.com/tibabouk/ICE-CODE-mobile.git
   cd ICE-CODE-mobile
   npm install
   npm i react-native-nfc-manager
   ```

### 3. Verify Setup

The collaborator should be able to:
- ✅ Clone the repository
- ✅ Create and push branches
- ✅ Use GitHub Copilot suggestions in the codebase
- ✅ Create pull requests

## Quick Commands

```bash
# Check current collaborators
gh api repos/tibabouk/ICE-CODE-mobile/collaborators

# Add collaborator via CLI (if you have gh CLI installed)
gh api repos/tibabouk/ICE-CODE-mobile/collaborators/USERNAME \
  --method PUT --field permission=push
```

## Troubleshooting

- **Invitation not received**: Check spam folder, try username instead of email
- **Copilot not working**: Verify subscription and IDE extension
- **Permission denied**: Ensure invitation was accepted and correct permissions set

For detailed documentation, see [COLLABORATION.md](COLLABORATION.md).