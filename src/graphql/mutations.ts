/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createBusiness = /* GraphQL */ `mutation CreateBusiness(
  $condition: ModelBusinessConditionInput
  $input: CreateBusinessInput!
) {
  createBusiness(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateBusinessMutationVariables,
  APITypes.CreateBusinessMutation
>;
export const createReview = /* GraphQL */ `mutation CreateReview(
  $condition: ModelReviewConditionInput
  $input: CreateReviewInput!
) {
  createReview(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateReviewMutationVariables,
  APITypes.CreateReviewMutation
>;
export const createUser = /* GraphQL */ `mutation CreateUser(
  $condition: ModelUserConditionInput
  $input: CreateUserInput!
) {
  createUser(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateUserMutationVariables,
  APITypes.CreateUserMutation
>;
export const deleteBusiness = /* GraphQL */ `mutation DeleteBusiness(
  $condition: ModelBusinessConditionInput
  $input: DeleteBusinessInput!
) {
  deleteBusiness(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteBusinessMutationVariables,
  APITypes.DeleteBusinessMutation
>;
export const deleteReview = /* GraphQL */ `mutation DeleteReview(
  $condition: ModelReviewConditionInput
  $input: DeleteReviewInput!
) {
  deleteReview(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteReviewMutationVariables,
  APITypes.DeleteReviewMutation
>;
export const deleteUser = /* GraphQL */ `mutation DeleteUser(
  $condition: ModelUserConditionInput
  $input: DeleteUserInput!
) {
  deleteUser(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteUserMutationVariables,
  APITypes.DeleteUserMutation
>;
export const updateBusiness = /* GraphQL */ `mutation UpdateBusiness(
  $condition: ModelBusinessConditionInput
  $input: UpdateBusinessInput!
) {
  updateBusiness(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateBusinessMutationVariables,
  APITypes.UpdateBusinessMutation
>;
export const updateReview = /* GraphQL */ `mutation UpdateReview(
  $condition: ModelReviewConditionInput
  $input: UpdateReviewInput!
) {
  updateReview(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateReviewMutationVariables,
  APITypes.UpdateReviewMutation
>;
export const updateUser = /* GraphQL */ `mutation UpdateUser(
  $condition: ModelUserConditionInput
  $input: UpdateUserInput!
) {
  updateUser(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateUserMutationVariables,
  APITypes.UpdateUserMutation
>;
