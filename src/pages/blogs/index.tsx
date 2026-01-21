import Head from 'next/head';
import { useCallback } from 'react';
import { useRouter } from 'next/router';
import SearchPlus from '@/Icons/SearchPlus';
import Link2AngularRight from '@/Icons/Link2AngularRight';
import Link from 'next/link';
import Image from 'next/image';
import { GetServerSideProps } from 'next';
import serverApi from '@/config/server-api';
import styles from '@/styles/Blogs.module.scss';

interface Blog {
  _id: string;
  title: string;
  content: string;
  coverImage: string;
  excerpt?: string;
  slug: string;
  category?: string;
  tags?: string[];
  image?: string;
  published: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BlogProps {
  blogs: Blog[];
}

function truncateText(text: string, maxLength: number): string {
  const plainText = text.replace(/<[^>]*>/g, '');
  if (plainText.length < 1) return '';
  return plainText.length > maxLength
    ? plainText.slice(0, maxLength) + '...'
    : plainText;
}

export default function Blog({ blogs }: BlogProps) {
  const router = useRouter();

  const handleBlogClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const blogId = e.currentTarget.dataset.id;
      if (blogId) {
        router.push(`/blogs/${blogId}`);
      }
    },
    [router]
  );

  return (
    <>
      <Head>
        <title>Blogs - Md Ikram</title>
      </Head>
      <section id='blog'>
        <h1 className='blog-title'>
          <div className='color-wh'>Blogs</div>
          <div className='title-border'>
            <div className='title-border-width'></div>
          </div>
        </h1>

        <div className={styles.blogsContainer}>
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <div className={styles.blogItem} key={blog._id} data-id={blog._id} onClick={handleBlogClick}>
                <div className={styles.blogImageContainer}>
                  <div className={styles.blogImageOverlay}>
                    <a className='view-button'>
                      <SearchPlus />
                    </a>
                    <Link href={`/blogs/${blog.slug}`}>
                      <Link2AngularRight />
                    </Link>
                  </div>
                  <Image 
                    src={blog?.coverImage || '/images/default-blog.jpg'} 
                    alt={blog.title}
                    width={400} 
                    height={250} 
                    onError={(e) => { 
                      (e.target as HTMLImageElement).src = '/images/default-blog.jpg';
                    }}
                  />
                </div>
                <div className={styles.blogDetailsContainer}>
                  <h3 className={styles.blogTitle} title={blog.title}>
                    {truncateText(blog.title, 25)}
                  </h3>
                  <p className={styles.blogDesc}>
                    {truncateText(blog.excerpt || blog.content, 30)}
                  </p>
                  {blog.category && (
                    <span className={styles.blogCategory}>{blog.category}</span>
                  )}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className={styles.blogTags}>
                      {blog.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className={styles.blogTag}>{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noBlogs}>
              <h3>No blogs found</h3>
              <p>Check back later for new content.</p>
            </div>
          )}
        </div>

      </section>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<BlogProps> = async () => {
  try {
    const response = await serverApi.get('/api/blogs?published=true');
    
    return {
      props: {
        blogs: response.data?.blogs || []
      }
    };
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return {
      props: {
        blogs: []
      }
    };
  }
};