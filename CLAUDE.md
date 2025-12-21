# Lending Heights Mortgage - Project Documentation

## Project Overview

This is the Lending Heights Mortgage website/application. Lending Heights is a mortgage company with the mission to "create the best place for great loan officers to work."

**Current Priority**: Resolving Vercel deployment issues and getting the site successfully deployed.

## Brand Identity

### Colors
- **Primary Blue**: `#0058A9` - Main brand color
- **Red**: `#FF2260` - Accent color
- **Yellow**: `#E2C20A` - Secondary accent

### Typography
- **Font Family**: Poppins (all weights)
- Use Poppins throughout the application for consistency

### Brand Values
- Excellence in service
- Support for loan officers
- Professional, trustworthy, modern

## Technology Stack

### Core Technologies
- **Framework**: Next.js (latest stable version preferred)
- **UI Library**: React with TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

### Code Conventions
- Use TypeScript for type safety
- Functional components with hooks (no class components)
- Follow React best practices
- Use Tailwind utility classes for styling
- Prefer modern ES6+ syntax

## Vercel Deployment Troubleshooting

### Common Issues to Check

1. **Build Configuration**
   - Verify `package.json` has correct build scripts
   - Check for build command: `"build": "next build"`
   - Ensure all dependencies are in `dependencies` (not just `devDependencies`)

2. **Environment Variables**
   - Check if any required environment variables are missing in Vercel dashboard
   - Verify `.env.local` variables are properly configured in Vercel project settings

3. **Node Version**
   - Ensure `package.json` specifies compatible Node.js version in `engines` field
   - Vercel default Node version may conflict with local development

4. **Import/Export Issues**
   - Check for incorrect imports (case sensitivity matters in production)
   - Look for circular dependencies
   - Verify all imported files exist with correct paths

5. **Next.js Configuration**
   - Review `next.config.js` for any local-only configurations
   - Check image optimization settings
   - Verify API routes are properly configured

6. **TypeScript Errors**
   - Production builds are stricter - all TypeScript errors must be resolved
   - Check `tsconfig.json` settings
   - Run `npm run build` locally to catch errors before deployment

7. **Dependencies**
   - Look for missing packages in `package.json`
   - Check for version conflicts
   - Ensure `package-lock.json` or `yarn.lock` is committed

8. **File Size/Optimization**
   - Check for overly large dependencies causing build timeouts
   - Look for unoptimized images or assets
   - Verify bundle size isn't exceeding limits

### Debugging Workflow

When helping debug Vercel deployment issues:

1. First, ask to see the **Vercel build logs** - this is the most important diagnostic tool
2. Check the **Vercel dashboard** for specific error messages
3. Reproduce the build locally: `npm run build`
4. Review recent changes that might have broken deployment
5. Check Vercel project settings for misconfigurations

## Development Guidelines

### When Making Changes
- Test locally with `npm run dev` before committing
- Run `npm run build` to verify production build works
- Check TypeScript compilation: `npx tsc --noEmit`
- Ensure code follows existing patterns in the codebase

### File Organization
- Components should be modular and reusable
- Keep Lending Heights brand colors and Poppins font consistent
- Use meaningful, descriptive names for files and components

### Styling Guidelines
- Use Tailwind utility classes
- Apply brand colors using Tailwind config or inline hex values
- Ensure responsive design (mobile-first approach)
- Maintain consistent spacing and typography

## Git Workflow
- Create descriptive commit messages
- Test builds before pushing
- Document any configuration changes
- Keep environment-specific configs out of version control

## Questions to Ask When Debugging

If Claude Code encounters deployment issues, it should ask:

1. "Can you share the complete Vercel build logs?"
2. "What error message is Vercel showing?"
3. "Did the deployment work previously? If so, what changed since then?"
4. "Are there any environment variables required for the build?"
5. "What does the local build output show when you run `npm run build`?"

## Success Criteria

A successful deployment means:
- Build completes without errors on Vercel
- Site is accessible at the Vercel URL
- All pages render correctly
- Brand colors and Poppins font display properly
- No console errors in production
- Environment variables are properly configured

## Communication Style

When working with this codebase:
- Be direct and solution-focused
- Provide specific, actionable fixes
- Explain WHY a change will help (not just WHAT to change)
- Reference Vercel documentation when relevant
- Suggest running local tests before redeploying

---

**Note to Claude Code**: Vinny is experienced with React, Next.js, and web development. You can use technical terminology and provide detailed explanations. Focus on solving the Vercel deployment issue efficiently.
