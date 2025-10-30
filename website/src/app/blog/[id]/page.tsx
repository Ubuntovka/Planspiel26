import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ParticlesBackground } from '../../components/ParticlesBackground/ParticlesBackground';

interface BlogDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Simple blog data directly in the component for testing
const blogPosts = [
  {
    id: "1",
    title: "The Future of Web Development",
    excerpt: "Exploring the latest trends and technologies shaping the future of web development in 2024.",
    content: `
# The Future of Web Development

Web development is evolving at an unprecedented pace. As we move through 2024, several key trends are emerging that will shape the future of how we build and interact with web applications.

## Key Trends

### 1. AI-Powered Development
Artificial Intelligence is revolutionizing how developers write code. From intelligent code completion to automated testing, AI tools are becoming indispensable in the development workflow.

### 2. Edge Computing
With the rise of edge computing, applications are becoming faster and more responsive. This technology brings computation closer to users, reducing latency and improving user experience.

### 3. Progressive Web Apps (PWAs)
PWAs continue to bridge the gap between web and native applications, offering offline functionality and app-like experiences.

## Conclusion

The future of web development is bright, with new technologies constantly emerging to make development more efficient and user experiences more engaging.
    `,
    author: "John Doe",
    date: "2024-01-15",
    image: "/images/elon.jpg",
    tags: ["Web Development", "Technology", "Future"],
    readTime: "5 min read"
  },
  {
    id: "2",
    title: "Building Scalable React Applications",
    excerpt: "Best practices and patterns for creating maintainable and scalable React applications.",
    content: `
# Building Scalable React Applications

Creating scalable React applications requires careful planning and adherence to best practices. Here are some key strategies to consider.

## Component Architecture

### 1. Component Composition
Use composition over inheritance to create flexible and reusable components.

### 2. State Management
Choose the right state management solution based on your application's complexity.

### 3. Performance Optimization
Implement proper memoization and code splitting to ensure optimal performance.

## Best Practices

- Keep components small and focused
- Use TypeScript for better type safety
- Implement proper error boundaries
- Write comprehensive tests

## Conclusion

Following these practices will help you build React applications that are maintainable, performant, and scalable.
    `,
    author: "Jane Smith",
    date: "2024-01-10",
    image: "/images/elon.jpg",
    tags: ["React", "JavaScript", "Frontend"],
    readTime: "7 min read"
  },
  {
    id: "3",
    title: "The Art of Clean Code",
    excerpt: "Principles and practices for writing clean, maintainable code that your future self will thank you for.",
    content: `
# The Art of Clean Code

Clean code is not just about making code work—it's about making code readable, maintainable, and elegant.

## Core Principles

### 1. Meaningful Names
Choose names that reveal intent and make the code self-documenting.

### 2. Functions Should Do One Thing
Each function should have a single responsibility and do it well.

### 3. Comments Should Explain Why, Not What
Good code is self-explanatory. Comments should only explain the reasoning behind complex logic.

## Benefits of Clean Code

- Easier to maintain and debug
- Faster onboarding for new developers
- Reduced technical debt
- Better collaboration

## Conclusion

Investing time in writing clean code pays dividends in the long run, making your codebase more maintainable and enjoyable to work with.
    `,
    author: "Mike Johnson",
    date: "2024-01-05",
    image: "/images/elon.jpg",
    tags: ["Programming", "Best Practices", "Code Quality"],
    readTime: "6 min read"
  }
];

function getBlogPostById(id: string) {
  return blogPosts.find(post => post.id === id);
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { id } = await params;
  const post = getBlogPostById(id);

  if (!post) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const relatedPosts = blogPosts.filter(p => p.id !== id).slice(0, 3);

  return (
      <></>
  );
}