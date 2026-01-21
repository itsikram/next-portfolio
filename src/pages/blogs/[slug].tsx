import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { GetServerSideProps } from 'next';
import serverApi from '@/config/server-api';
import styles from '@/styles/BlogPost.module.scss';

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  coverImage?: string;
  excerpt?: string;
  slug: string;
  category?: string;
  tags?: string[];
  author?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface BlogPostProps {
  blog: BlogPost | null;
}

export default function BlogPost({ blog }: BlogPostProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!blog) {
    return (
      <div className={styles.blogPostError}>
        <h2>Blog Post Not Found</h2>
        <p>The blog post you're looking for doesn't exist or has been removed.</p>
        <Link href="/blogs" className={styles.backToBlogs}>
          <ArrowLeft size={20} />
          Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{blog.title} - Md Ikram</title>
        <meta name="description" content={blog.excerpt || blog.title} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt || blog.title} />
        {blog.coverImage && <meta property="og:image" content={blog.coverImage} />}
      </Head>

      <article className={styles.blogPost}>
        <div className={styles.blogPostHeader}>
          <Link href="/blogs" className={styles.backToBlogs}>
            <ArrowLeft size={20} />
            Back to Blogs
          </Link>
          
          <div className={styles.blogPostHero}>
            {blog.coverImage && (
              <div className={styles.blogPostImageContainer}>
                <Image 
                  src={blog.coverImage} 
                  alt={blog.title}
                  width={1200} 
                  height={400} 
                  className={styles.blogPostHeroImage}
                  onError={(e) => { 
                    (e.target as HTMLImageElement).src = '/images/default-blog.jpg';
                  }}
                />
              </div>
            )}
            
            <div className={styles.blogPostMeta}>
              <h1 className={styles.blogPostTitle}>{blog.title}</h1>
              
              <div className={styles.blogPostInfo}>
                {blog.author && (
                  <div className={styles.metaItem}>
                    <User size={16} />
                    <span>{blog.author}</span>
                  </div>
                )}
                <div className={styles.metaItem}>
                  <Calendar size={16} />
                  <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                </div>
                {blog.category && (
                  <div className={styles.metaItem}>
                    <Tag size={16} />
                    <span>{blog.category}</span>
                  </div>
                )}
              </div>
              
              {blog.tags && blog.tags.length > 0 && (
                <div className={styles.blogPostTags}>
                  {blog.tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.blogPostContent}>
          <div 
            className={styles.blogContent}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>

        <div className={styles.blogPostFooter}>
          <div className={styles.blogNavigation}>
            <Link href="/blogs" className={styles.backToBlogs}>
              <ArrowLeft size={20} />
              Back to All Blogs
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<BlogPostProps> = async ({ params }) => {
  try {
    const slug = params?.slug as string;
    if (!slug) {
      return {
        props: {
          blog: null
        }
      };
    }

    const response = await serverApi.get(`/api/blogs/${slug}`);
    
    return {
      props: {
        blog: response.data || null
      }
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    
    // Fallback to static data for demo purposes
    const fallbackBlogs: { [key: string]: BlogPost } = {
      'getting-started-wordpress': {
        _id: '1',
        title: "Getting Started with WordPress Development",
        coverImage: '/images/default-blog.jpg',
        content: `<h2>Introduction to WordPress Development</h2><p>WordPress development is a valuable skill in today&apos;s web development landscape.</p>`,
        slug: 'getting-started-wordpress',
        category: 'WordPress',
        tags: ['WordPress', 'PHP', 'Web Development'],
        author: 'Md Ikram',
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      'mern-stack-best-practices': {
        _id: '2',
        title: "MERN Stack Best Practices",
        coverImage: '/images/default-blog.jpg',
        content: `<h2>Building Scalable Applications with MERN Stack</h2><p>The MERN stack (MongoDB, Express.js, React.js, Node.js) provides a powerful combination for building full-stack JavaScript applications.</p>`,
        slug: 'mern-stack-best-practices',
        category: 'MERN Stack',
        tags: ['MERN', 'React', 'Node.js', 'MongoDB'],
        author: 'Md Ikram',
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      'performance-optimization': {
        _id: '3',
        title: "Performance Optimization Techniques",
        coverImage: '/images/default-blog.jpg',
        content: `<h2>Essential Web Performance Optimization</h2><p>Website performance directly impacts user experience and search engine rankings.</p>`,
        slug: 'performance-optimization',
        category: 'Performance',
        tags: ['Performance', 'Optimization', 'Web Development'],
        author: 'Md Ikram',
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };

    const slug = params?.slug as string;
    return {
      props: {
        blog: fallbackBlogs[slug] || null
      }
    };
  }
};