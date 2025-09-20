# Contributing to ICE-CODE-mobile

Thank you for your interest in contributing to ICE-CODE-mobile! This document provides guidelines for contributing to this React Native NFC application.

## Quick Start for New Contributors

### 1. Getting Access
- **Repository Owner**: Follow our [Quick Setup Guide](docs/QUICK-SETUP.md) to invite collaborators
- **Contributors**: Accept the repository invitation and set up your development environment

### 2. Development Setup
```bash
# Clone the repository
git clone https://github.com/tibabouk/ICE-CODE-mobile.git
cd ICE-CODE-mobile

# Install dependencies
npm install
npm i react-native-nfc-manager

# Set up React Native development environment
# Follow https://reactnative.dev/docs/environment-setup
```

### 3. GitHub Copilot Setup (Optional but Recommended)
If you have GitHub Copilot access:
```bash
# Install VS Code extensions
code --install-extension GitHub.copilot
code --install-extension GitHub.copilot-chat
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension ms-react-native.vscode-react-native
```

## Development Workflow

### Branch Strategy
1. **Create a feature branch** from `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards
3. **Test thoroughly** (especially NFC functionality on real devices)
4. **Commit with descriptive messages**:
   ```bash
   git commit -m "feat: add contact validation for emergency fields"
   ```

5. **Push and create a pull request**:
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Format
We follow conventional commits:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## Testing Requirements

### Essential Testing
- **Physical Device Testing**: NFC functionality MUST be tested on real devices
- **Platform Testing**: Test on both Android and iOS when possible
- **JSON Export**: Verify compatibility with NFC Writer (ntgui_version=18)

### Test Checklist
- [ ] NFC read/write operations work correctly
- [ ] JSON export generates valid format
- [ ] UI responds appropriately on different screen sizes
- [ ] No runtime errors or warnings
- [ ] Code follows TypeScript best practices

## Code Standards

### File Structure
- **Screens**: `src/screens/` - React Native screen components
- **Services**: `src/services/` - Business logic and utilities
- **Types**: Use TypeScript interfaces for data structures
- **Documentation**: Update relevant docs for new features

### Key Areas
- **NFC Service** (`src/services/ndef.ts`): Core NFC functionality
- **Main Screen** (`src/screens/EncodeScreen.tsx`): Primary user interface
- **App Entry** (`App.tsx`): Application root component

### Coding Guidelines
- Use TypeScript for all new code
- Follow React Native best practices
- Maintain compatibility with both iOS and Android
- Keep functions focused and well-documented
- Use meaningful variable and function names

## Documentation

### Required Documentation Updates
- Update README.md if adding new features or changing setup
- Add code comments for complex NFC operations
- Update API documentation if changing data structures
- Include usage examples for new components

### Documentation Structure
- **README.md**: Overview and setup instructions
- **docs/COLLABORATION.md**: Detailed collaboration guide
- **docs/QUICK-SETUP.md**: Quick reference for repository management
- **docs/api-sidecar.md**: API documentation for future features

## Review Process

### Pull Request Guidelines
1. **Use the PR template** (automatically loaded)
2. **Provide clear description** of changes and rationale
3. **Include screenshots** for UI changes
4. **Reference related issues** using `Fixes #123` or `Relates to #123`
5. **Ensure CI checks pass** (when CI is configured)

### Review Criteria
- Code quality and readability
- Test coverage and device testing
- Documentation completeness
- No breaking changes (unless necessary)
- Performance considerations for mobile devices

## Getting Help

### Communication Channels
- **Issues**: Use GitHub issues for bug reports and feature requests
- **Discussions**: Use GitHub discussions for questions and ideas
- **Pull Requests**: Use PR comments for code-specific discussions

### Resources
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [NFC Manager Library](https://github.com/whitedogg13/react-native-nfc-manager)
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Common Issues
- **NFC not working**: Ensure testing on physical device with NFC support
- **Build errors**: Check React Native environment setup
- **Copilot suggestions**: Verify extension installation and GitHub authentication

## Project Roadmap

Current priorities:
- Magic link authentication + Community Builder sync
- Conflict resolution between NFC tags and online data
- App store deployment (Google Play, Apple App Store)

See [README.md](README.md) for the complete roadmap.

## Repository Management

For repository owners and maintainers, see our comprehensive [Collaboration Guide](docs/COLLABORATION.md) which covers:
- Inviting collaborators and GitHub Copilot users
- Managing permissions and access levels
- Security best practices
- Organization-level Copilot management

## License

By contributing to ICE-CODE-mobile, you agree that your contributions will be licensed under the same license as the project (see [LICENSE](LICENSE) file).