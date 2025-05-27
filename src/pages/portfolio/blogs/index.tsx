import Head from 'next/head';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import SearchPlus from '@/Icons/SearchPlus';
import Link2AngularRight from '@/Icons/Link2AngularRight';
import Link from 'next/link';
import BlogSkleton from '@/skletons/blogs/blogSkleton';
import { GetStaticProps } from 'next';

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



export default function Blog() {

  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([])

  useEffect(() => {
    fetch('https://programmerikram.com/wp-json/wp/v2/posts').then(res => res.json()).then(data => {
      console.log('datta', data)
      setBlogs(data)
    })

  }, [])

  const handleBlogClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const blogId = e.currentTarget.dataset.id;
    if (blogId) {
      router.push(`/portfolio/blogs/${blogId}`);
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
                    <Link href={`/portfolio//blogs/${blog.id}`}>

                      <Link2AngularRight />

                    </Link>
                  </div>
                  <img src={`${blog?.meta && blog.meta?._blog_image}`} onError={(e) => { (e.target as HTMLImageElement).style.height = '100px';}}  alt=''/>
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
  const res = await fetch('https://programmerikram.com/wp-json/wp/v2/posts');
  const data = await res.json();

  // Optional: add validation or fallback if data is null or empty
  if (!data || !Array.isArray(data)) {
    return { props: { blogs: [] } };
  }

  return {
    props: {
      blogs: data,
    }
  };
};