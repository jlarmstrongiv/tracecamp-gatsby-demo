/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require("path")
const slugify = require("slugify")
// You can delete this file if you're not using it
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    // Get the parent node
    const parent = getNode(node.parent)

    // Create a field on this node for the "collection" of the parent
    // NOTE: This is necessary so we can filter `allMarkdownRemark` by
    // `collection` otherwise there is no way to filter for only markdown
    // documents of type `post`.
    createNodeField({
      node,
      name: "collection",
      value: parent.sourceInstanceName,
    })
    switch (parent.sourceInstanceName) {
      case "instructors":
        createNodeField({
          node,
          name: "slug",
          value: `/instructors/${slugify(node.frontmatter.name, {
            lower: true,
          })}/`,
        })
        break
      case "courses":
        createNodeField({
          node,
          name: "slug",
          value: `/courses/${slugify(parent.relativeDirectory, {
            lower: true,
          })}/`,
        })
        break
    }
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const instructors = await graphql(`
    query {
      instructors: allMarkdownRemark(
        filter: { fields: { collection: { eq: "instructors" } } }
        sort: { order: ASC, fields: frontmatter___name }
      ) {
        edges {
          previous {
            fields {
              slug
            }
          }
          node {
            fields {
              slug
            }
          }
          next {
            fields {
              slug
            }
          }
        }
      }
    }
  `)
  if (instructors.errors) throw instructors.errors

  instructors.data.instructors.edges.forEach(edge => {
    createPage({
      component: path.resolve("src/templates/Instructor/Instructor.js"),
      path: edge.node.fields.slug,
      context: {
        slug: edge.node.fields.slug,
        previous: edge.previous && edge.previous.fields.slug,
        next: edge.next && edge.next.fields.slug,
      },
    })
  })

  const courses = await graphql(`
    query {
      courses: allMarkdownRemark(
        filter: {
          fields: { collection: { eq: "courses" } }
          frontmatter: { isPublished: { eq: true } }
        }
        sort: { order: ASC, fields: frontmatter___index }
      ) {
        edges {
          previous {
            fields {
              slug
            }
          }
          node {
            fields {
              slug
            }
          }
          next {
            fields {
              slug
            }
          }
        }
      }
    }
  `)
  if (courses.errors) throw courses.errors

  courses.data.courses.edges.forEach(edge => {
    createPage({
      component: path.resolve("src/templates/Course/Course.js"),
      path: edge.node.fields.slug,
      context: {
        slug: edge.node.fields.slug,
        previous: edge.previous && edge.previous.fields.slug,
        next: edge.next && edge.next.fields.slug,
      },
    })
  })
}
