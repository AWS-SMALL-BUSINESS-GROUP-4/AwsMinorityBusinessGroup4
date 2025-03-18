/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateBusiness = /* GraphQL */ `subscription OnCreateBusiness(
  $filter: ModelSubscriptionBusinessFilterInput
  $owner: String
) {
  onCreateBusiness(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateBusinessSubscriptionVariables,
  APITypes.OnCreateBusinessSubscription
>;
export const onCreateReview = /* GraphQL */ `subscription OnCreateReview(
  $filter: ModelSubscriptionReviewFilterInput
  $owner: String
) {
  onCreateReview(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateReviewSubscriptionVariables,
  APITypes.OnCreateReviewSubscription
>;
export const onCreateUser = /* GraphQL */ `subscription OnCreateUser(
  $filter: ModelSubscriptionUserFilterInput
  $owner: String
) {
  onCreateUser(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateUserSubscriptionVariables,
  APITypes.OnCreateUserSubscription
>;
export const onDeleteBusiness = /* GraphQL */ `subscription OnDeleteBusiness(
  $filter: ModelSubscriptionBusinessFilterInput
  $owner: String
) {
  onDeleteBusiness(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteBusinessSubscriptionVariables,
  APITypes.OnDeleteBusinessSubscription
>;
export const onDeleteReview = /* GraphQL */ `subscription OnDeleteReview(
  $filter: ModelSubscriptionReviewFilterInput
  $owner: String
) {
  onDeleteReview(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteReviewSubscriptionVariables,
  APITypes.OnDeleteReviewSubscription
>;
export const onDeleteUser = /* GraphQL */ `subscription OnDeleteUser(
  $filter: ModelSubscriptionUserFilterInput
  $owner: String
) {
  onDeleteUser(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteUserSubscriptionVariables,
  APITypes.OnDeleteUserSubscription
>;
export const onUpdateBusiness = /* GraphQL */ `subscription OnUpdateBusiness(
  $filter: ModelSubscriptionBusinessFilterInput
  $owner: String
) {
  onUpdateBusiness(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateBusinessSubscriptionVariables,
  APITypes.OnUpdateBusinessSubscription
>;
export const onUpdateReview = /* GraphQL */ `subscription OnUpdateReview(
  $filter: ModelSubscriptionReviewFilterInput
  $owner: String
) {
  onUpdateReview(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateReviewSubscriptionVariables,
  APITypes.OnUpdateReviewSubscription
>;
export const onUpdateUser = /* GraphQL */ `subscription OnUpdateUser(
  $filter: ModelSubscriptionUserFilterInput
  $owner: String
) {
  onUpdateUser(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateUserSubscriptionVariables,
  APITypes.OnUpdateUserSubscription
>;
