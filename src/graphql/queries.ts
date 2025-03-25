/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getBusiness = /* GraphQL */ `query GetBusiness($id: ID!) {
  getBusiness(id: $id) {
    aptSuiteOther
    averageRating
    businessHours
    businessOwner {
      createdAt
      email
      id
      joinedAt
      lastLogin
      owner
      profilePic
      updatedAt
      __typename
    }
    businessOwnerId
    category
    city
    country
    createdAt
    description
    email
    id
    location {
      lattitude
      longitude
      __typename
    }
    name
    owner
    phoneNumber
    photos
    reviews {
      nextToken
      __typename
    }
    state
    streetAddress
    updatedAt
    website
    zipcode
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetBusinessQueryVariables,
  APITypes.GetBusinessQuery
>;
export const getReview = /* GraphQL */ `query GetReview($id: ID!) {
  getReview(id: $id) {
    business {
      aptSuiteOther
      averageRating
      businessHours
      businessOwnerId
      category
      city
      country
      createdAt
      description
      email
      id
      name
      owner
      phoneNumber
      photos
      state
      streetAddress
      updatedAt
      website
      zipcode
      __typename
    }
    businessId
    content
    createdAt
    id
    owner
    rating
    reviewDate
    updatedAt
    user {
      createdAt
      email
      id
      joinedAt
      lastLogin
      owner
      profilePic
      updatedAt
      __typename
    }
    userId
    __typename
  }
}
` as GeneratedQuery<APITypes.GetReviewQueryVariables, APITypes.GetReviewQuery>;
export const getUser = /* GraphQL */ `query GetUser($id: ID!) {
  getUser(id: $id) {
    businesses {
      nextToken
      __typename
    }
    createdAt
    email
    id
    joinedAt
    lastLogin
    name {
      firstName
      lastName
      __typename
    }
    owner
    profilePic
    reviews {
      nextToken
      __typename
    }
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetUserQueryVariables, APITypes.GetUserQuery>;
export const listBusinesses = /* GraphQL */ `query ListBusinesses(
  $filter: ModelBusinessFilterInput
  $limit: Int
  $nextToken: String
) {
  listBusinesses(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      aptSuiteOther
      averageRating
      businessHours
      businessOwnerId
      category
      city
      country
      createdAt
      description
      email
      id
      name
      owner
      phoneNumber
      photos
      state
      streetAddress
      updatedAt
      website
      zipcode
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListBusinessesQueryVariables,
  APITypes.ListBusinessesQuery
>;
export const listReviews = /* GraphQL */ `query ListReviews(
  $filter: ModelReviewFilterInput
  $limit: Int
  $nextToken: String
) {
  listReviews(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      businessId
      content
      createdAt
      id
      owner
      rating
      reviewDate
      updatedAt
      userId
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListReviewsQueryVariables,
  APITypes.ListReviewsQuery
>;
export const listUsers = /* GraphQL */ `query ListUsers(
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      email
      id
      joinedAt
      lastLogin
      owner
      profilePic
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListUsersQueryVariables, APITypes.ListUsersQuery>;
