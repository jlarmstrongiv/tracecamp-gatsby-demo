import React from "react"
import Seo from "../components/seo"
import { Link, graphql, useStaticQuery } from "gatsby"
import Img from "gatsby-image"
import { Button } from "reactstrap"

export default function IndexPage() {
  const data = useStaticQuery(graphql`
    query {
      courses: allMarkdownRemark(
        filter: {
          fields: { collection: { eq: "courses" } }
          frontmatter: { isPublished: { eq: true } }
        }
        sort: { order: ASC, fields: frontmatter___index }
      ) {
        edges {
          node {
            id
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
            fields {
              slug
              collection
            }
          }
        }
      }

      instructors: allMarkdownRemark(
        filter: { fields: { collection: { eq: "instructors" } } }
        sort: { order: ASC, fields: frontmatter___name }
      ) {
        edges {
          node {
            id
            fields {
              slug
            }
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
        }
      }
    }
  `)
  return (
    <React.Fragment>
      <Seo title="Home" />
      <h1>Hi courses</h1>
      <Button color="primary">Reactstrap Button</Button>
      {data.courses.edges.map(edge => (
        <div key={edge.node.id}>
          <Img
            fluid={edge.node.frontmatter.featuredImage.childImageSharp.fluid}
          />
          <Link to={edge.node.fields.slug}>
            <h2>{edge.node.frontmatter.title}</h2>
          </Link>{" "}
          {edge.node.frontmatter.description}
        </div>
      ))}
      <h1>Hi people</h1>
      {data.instructors.edges.map(edge => (
        <div key={edge.node.id}>
          <Img fixed={edge.node.frontmatter.avatar.childImageSharp.fixed} />
          <p>
            <Link to={edge.node.fields.slug}>{edge.node.frontmatter.name}</Link>{" "}
            · {edge.node.frontmatter.position}
          </p>
        </div>
      ))}
      <p>Welcome to your new Gatsby site.</p>
      <p>Now go build something great.</p>
      <Link to="/about">About Us</Link>
    </React.Fragment>
  )
}
