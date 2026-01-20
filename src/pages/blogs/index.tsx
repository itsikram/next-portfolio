import Head from 'next/head';
import { useCallback } from 'react';
import { useRouter } from 'next/router';
import SearchPlus from '@/Icons/SearchPlus';
import Link2AngularRight from '@/Icons/Link2AngularRight';
import Link from 'next/link';
import BlogSkleton from '@/skletons/blogs/blogSkleton';
import { GetStaticProps } from 'next';
import Image from 'next/image';

type Blog = {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  meta?: {
    _blog_image?: string;
  };
};

type Props = {
  blogs: Blog[];
};


function truncateText(text: string, maxLength: number): string {
  const plainText = text.replace(/<[^>]*>/g, '');
  if (plainText.length < 1) return '';
  return plainText.length > maxLength
    ? plainText.slice(0, maxLength) + '...'
    : plainText;
}



export default function Blog({ blogs }: Props) {

  const router = useRouter();

  const handleBlogClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const blogId = e.currentTarget.dataset.id;
    if (blogId) {
      router.push(`/blogs/${blogId}`);
    }
    },
    [router] // Add any dependencies here if needed
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

        <div className='blogs-container'>

          {blogs.length > 0 ? blogs.map((blog : Blog, key) => {

            return (
              <div className='blog-item' key={key} data-id={blog.id} onClick={handleBlogClick}>
                <div className='blog-image-container'>
                  <div className='blog-image-overlay'>
                    <a className='view-button'>
                      <SearchPlus />
                    </a>
                    <Link href={`/blogs/${blog.id}`}>

                      <Link2AngularRight />

                    </Link>
                  </div>
                  <Image src={`${blog?.meta && blog.meta?._blog_image}`} onError={(e) => { (e.target as HTMLImageElement).style.height = '100px';}}  alt='' width={400} height={250} />
                </div>
                <div className='blog-details-container'>
                  <h3 className='blog-title' title={blog.title.rendered}>{truncateText(blog.title.rendered, 25)}</h3>
                  <p className='blog-desc'>
                    {truncateText(blog.content.rendered, 30)}
                  </p>

                </div>

              </div>
            )

          })
            :

            <BlogSkleton count={6} />

          }


        </div>

      </section>
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  // Static blog data since the external API is not working
  const mockBlogs: Blog[] = [
    {
      id: 1,
      title: { rendered: "Getting Started with WordPress Development" },
      content: { rendered: "Learn the fundamentals of WordPress development and how to create custom themes and plugins." },
      meta: { _blog_image: "/images/blog-wordpress.jpg" }
    },
    {
      id: 2,
      title: { rendered: "MERN Stack Best Practices" },
      content: { rendered: "Discover the best practices for building scalable applications with MongoDB, Express, React, and Node.js." },
      meta: { _blog_image: "/images/blog-mern.jpg" }
    },
    {
      id: 3,
      title: { rendered: "Performance Optimization Techniques" },
      content: { rendered: "Essential techniques to optimize your web applications for better performance and user experience." },
      meta: { _blog_image: "/images/blog-performance.jpg" }
    }
  ];

  return {
    props: {
      blogs: mockBlogs,
    }
  };
};