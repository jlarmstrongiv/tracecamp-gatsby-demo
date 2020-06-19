import React from "react"
import { Link, graphql } from "gatsby"
import Img from "gatsby-image"
import NavBar from "../../components/Navbar/Navbar"

export const query = graphql`
  query($slug: String!, $previous: String, $next: String) {
    instructor: markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        name
        position
        avatar {
          childImageSharp {
            fixed(width: 100, height: 100) {
              ...GatsbyImageSharpFixed_withWebp
            }
          }
        }
      }
    }
    previous: markdownRemark(fields: { slug: { eq: $previous } }) {
      frontmatter {
        name
      }
      fields {
        slug
      }
    }
    next: markdownRemark(fields: { slug: { eq: $next } }) {
      frontmatter {
        name
      }
      fields {
        slug
      }
    }
  }
`

const wrapperStyle = { maxWidth: "700px", margin: "0 auto" }

export default function InstructorPage({ data }) {
  return (
    <div style={wrapperStyle}>
      <NavBar />
      <span>
        {data.instructor.frontmatter.name} ·{" "}
        {data.instructor.frontmatter.position}
        <Img fixed={data.instructor.frontmatter.avatar.childImageSharp.fixed} />
      </span>
      <div dangerouslySetInnerHTML={{ __html: data.instructor.html }} />
      {data.previous && (
        <div>
          Previous Instructor:{" "}
          <Link to={data.previous.fields.slug}>
            {data.previous.frontmatter.name}
          </Link>
        </div>
      )}
      {data.next && (
        <div>
          Next Instructor:{" "}
          <Link to={data.next.fields.slug}>{data.next.frontmatter.name}</Link>
        </div>
      )}
    </div>
  )
}
