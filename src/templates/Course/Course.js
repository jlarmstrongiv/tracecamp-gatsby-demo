import React from "react"
import { Link, graphql } from "gatsby"
import Img from "gatsby-image"
import NavBar from "../../components/Navbar/Navbar"

export const query = graphql`
  query($slug: String!, $previous: String, $next: String) {
    course: markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        description
        featuredImage {
          childImageSharp {
            fluid(maxWidth: 1000) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
      }
    }
    previous: markdownRemark(fields: { slug: { eq: $previous } }) {
      frontmatter {
        title
      }
      fields {
        slug
      }
    }
    next: markdownRemark(fields: { slug: { eq: $next } }) {
      frontmatter {
        title
      }
      fields {
        slug
      }
    }
  }
`

const wrapperStyle = { maxWidth: "700px", margin: "0 auto" }
const imageStyle = { maxWidth: "500px" }

export default function CoursePage({ data }) {
  return (
    <div style={wrapperStyle}>
      <NavBar />
      <div>
        <h2>{data.course.frontmatter.title}</h2>
        <p>{data.course.frontmatter.description}</p>
        <Img
          style={imageStyle}
          fluid={data.course.frontmatter.featuredImage.childImageSharp.fluid}
        />
        <div dangerouslySetInnerHTML={{ __html: data.course.html }} />
      </div>
      {data.previous && (
        <div>
          Previous:{" "}
          <Link to={data.previous.fields.slug}>
            {data.previous.frontmatter.title}
          </Link>
        </div>
      )}
      {data.next && (
        <div>
          Next:{" "}
          <Link to={data.next.fields.slug}>{data.next.frontmatter.title}</Link>
        </div>
      )}
    </div>
  )
}
