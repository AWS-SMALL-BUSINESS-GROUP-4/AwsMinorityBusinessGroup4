/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type Business = {
  __typename: "Business",
  aptSuiteOther?: string | null,
  averageRating?: number | null,
  businessHours?: string | null,
  businessOwner?: User | null,
  businessOwnerId?: string | null,
  category: string,
  city: string,
  country: string,
  createdAt: string,
  description: string,
  email: string,
  id: string,
  location?: BusinessLocation | null,
  name: string,
  owner?: string | null,
  phoneNumber: string,
  photos?: Array< string | null > | null,
  reviews?: ModelReviewConnection | null,
  state: string,
  streetAddress: string,
  updatedAt: string,
  website?: string | null,
  zipcode: string,
};

export type User = {
  __typename: "User",
  businesses?: ModelBusinessConnection | null,
  createdAt: string,
  email: string,
  id: string,
  joinedAt?: number | null,
  lastLogin?: number | null,
  name?: UserName | null,
  owner?: string | null,
  profilePic?: string | null,
  reviews?: ModelReviewConnection | null,
  updatedAt: string,
};

export type ModelBusinessConnection = {
  __typename: "ModelBusinessConnection",
  items:  Array<Business | null >,
  nextToken?: string | null,
};

export type UserName = {
  __typename: "UserName",
  firstName: string,
  lastName: string,
};

export type ModelReviewConnection = {
  __typename: "ModelReviewConnection",
  items:  Array<Review | null >,
  nextToken?: string | null,
};

export type Review = {
  __typename: "Review",
  business?: Business | null,
  businessId?: string | null,
  content: string,
  createdAt: string,
  id: string,
  owner?: string | null,
  rating: number,
  reviewDate?: number | null,
  updatedAt: string,
  user?: User | null,
  userId?: string | null,
};

export type BusinessLocation = {
  __typename: "BusinessLocation",
  lattitude?: number | null,
  longitude?: number | null,
};

export type ModelBusinessFilterInput = {
  and?: Array< ModelBusinessFilterInput | null > | null,
  aptSuiteOther?: ModelStringInput | null,
  averageRating?: ModelFloatInput | null,
  businessHours?: ModelStringInput | null,
  businessOwnerId?: ModelIDInput | null,
  category?: ModelStringInput | null,
  city?: ModelStringInput | null,
  country?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  description?: ModelStringInput | null,
  email?: ModelStringInput | null,
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  not?: ModelBusinessFilterInput | null,
  or?: Array< ModelBusinessFilterInput | null > | null,
  owner?: ModelStringInput | null,
  phoneNumber?: ModelStringInput | null,
  photos?: ModelStringInput | null,
  state?: ModelStringInput | null,
  streetAddress?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  website?: ModelStringInput | null,
  zipcode?: ModelStringInput | null,
};

export type ModelStringInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  _null = "_null",
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
}


export type ModelSizeInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelFloatInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelIDInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export type ModelReviewFilterInput = {
  and?: Array< ModelReviewFilterInput | null > | null,
  businessId?: ModelIDInput | null,
  content?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelReviewFilterInput | null,
  or?: Array< ModelReviewFilterInput | null > | null,
  owner?: ModelStringInput | null,
  rating?: ModelFloatInput | null,
  reviewDate?: ModelIntInput | null,
  updatedAt?: ModelStringInput | null,
  userId?: ModelIDInput | null,
};

export type ModelIntInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelUserFilterInput = {
  and?: Array< ModelUserFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  email?: ModelStringInput | null,
  id?: ModelIDInput | null,
  joinedAt?: ModelIntInput | null,
  lastLogin?: ModelIntInput | null,
  not?: ModelUserFilterInput | null,
  or?: Array< ModelUserFilterInput | null > | null,
  owner?: ModelStringInput | null,
  profilePic?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelUserConnection = {
  __typename: "ModelUserConnection",
  items:  Array<User | null >,
  nextToken?: string | null,
};

export type ModelBusinessConditionInput = {
  and?: Array< ModelBusinessConditionInput | null > | null,
  aptSuiteOther?: ModelStringInput | null,
  averageRating?: ModelFloatInput | null,
  businessHours?: ModelStringInput | null,
  businessOwnerId?: ModelIDInput | null,
  category?: ModelStringInput | null,
  city?: ModelStringInput | null,
  country?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  description?: ModelStringInput | null,
  email?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelBusinessConditionInput | null,
  or?: Array< ModelBusinessConditionInput | null > | null,
  owner?: ModelStringInput | null,
  phoneNumber?: ModelStringInput | null,
  photos?: ModelStringInput | null,
  state?: ModelStringInput | null,
  streetAddress?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  website?: ModelStringInput | null,
  zipcode?: ModelStringInput | null,
};

export type CreateBusinessInput = {
  aptSuiteOther?: string | null,
  averageRating?: number | null,
  businessHours?: string | null,
  businessOwnerId?: string | null,
  category: string,
  city: string,
  country: string,
  description: string,
  email: string,
  id?: string | null,
  location?: BusinessLocationInput | null,
  name: string,
  phoneNumber: string,
  photos?: Array< string | null > | null,
  state: string,
  streetAddress: string,
  website?: string | null,
  zipcode: string,
};

export type BusinessLocationInput = {
  lattitude?: number | null,
  longitude?: number | null,
};

export type ModelReviewConditionInput = {
  and?: Array< ModelReviewConditionInput | null > | null,
  businessId?: ModelIDInput | null,
  content?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  not?: ModelReviewConditionInput | null,
  or?: Array< ModelReviewConditionInput | null > | null,
  owner?: ModelStringInput | null,
  rating?: ModelFloatInput | null,
  reviewDate?: ModelIntInput | null,
  updatedAt?: ModelStringInput | null,
  userId?: ModelIDInput | null,
};

export type CreateReviewInput = {
  businessId?: string | null,
  content: string,
  id?: string | null,
  rating: number,
  reviewDate?: number | null,
  userId?: string | null,
};

export type ModelUserConditionInput = {
  and?: Array< ModelUserConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  email?: ModelStringInput | null,
  joinedAt?: ModelIntInput | null,
  lastLogin?: ModelIntInput | null,
  not?: ModelUserConditionInput | null,
  or?: Array< ModelUserConditionInput | null > | null,
  owner?: ModelStringInput | null,
  profilePic?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateUserInput = {
  email: string,
  id?: string | null,
  joinedAt?: number | null,
  lastLogin?: number | null,
  name?: UserNameInput | null,
  profilePic?: string | null,
};

export type UserNameInput = {
  firstName: string,
  lastName: string,
};

export type DeleteBusinessInput = {
  id: string,
};

export type DeleteReviewInput = {
  id: string,
};

export type DeleteUserInput = {
  id: string,
};

export type UpdateBusinessInput = {
  aptSuiteOther?: string | null,
  averageRating?: number | null,
  businessHours?: string | null,
  businessOwnerId?: string | null,
  category?: string | null,
  city?: string | null,
  country?: string | null,
  description?: string | null,
  email?: string | null,
  id: string,
  location?: BusinessLocationInput | null,
  name?: string | null,
  phoneNumber?: string | null,
  photos?: Array< string | null > | null,
  state?: string | null,
  streetAddress?: string | null,
  website?: string | null,
  zipcode?: string | null,
};

export type UpdateReviewInput = {
  businessId?: string | null,
  content?: string | null,
  id: string,
  rating?: number | null,
  reviewDate?: number | null,
  userId?: string | null,
};

export type UpdateUserInput = {
  email?: string | null,
  id: string,
  joinedAt?: number | null,
  lastLogin?: number | null,
  name?: UserNameInput | null,
  profilePic?: string | null,
};

export type ModelSubscriptionBusinessFilterInput = {
  and?: Array< ModelSubscriptionBusinessFilterInput | null > | null,
  aptSuiteOther?: ModelSubscriptionStringInput | null,
  averageRating?: ModelSubscriptionFloatInput | null,
  businessHours?: ModelSubscriptionStringInput | null,
  businessOwnerId?: ModelSubscriptionIDInput | null,
  category?: ModelSubscriptionStringInput | null,
  city?: ModelSubscriptionStringInput | null,
  country?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionBusinessFilterInput | null > | null,
  owner?: ModelStringInput | null,
  phoneNumber?: ModelSubscriptionStringInput | null,
  photos?: ModelSubscriptionStringInput | null,
  state?: ModelSubscriptionStringInput | null,
  streetAddress?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  website?: ModelSubscriptionStringInput | null,
  zipcode?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionStringInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionFloatInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  in?: Array< number | null > | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionIDInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionReviewFilterInput = {
  and?: Array< ModelSubscriptionReviewFilterInput | null > | null,
  businessId?: ModelSubscriptionIDInput | null,
  content?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionReviewFilterInput | null > | null,
  owner?: ModelStringInput | null,
  rating?: ModelSubscriptionFloatInput | null,
  reviewDate?: ModelSubscriptionIntInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  userId?: ModelSubscriptionIDInput | null,
};

export type ModelSubscriptionIntInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  in?: Array< number | null > | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionUserFilterInput = {
  and?: Array< ModelSubscriptionUserFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  joinedAt?: ModelSubscriptionIntInput | null,
  lastLogin?: ModelSubscriptionIntInput | null,
  or?: Array< ModelSubscriptionUserFilterInput | null > | null,
  owner?: ModelStringInput | null,
  profilePic?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type GetBusinessQueryVariables = {
  id: string,
};

export type GetBusinessQuery = {
  getBusiness?:  {
    __typename: "Business",
    aptSuiteOther?: string | null,
    averageRating?: number | null,
    businessHours?: string | null,
    businessOwner?:  {
      __typename: "User",
      createdAt: string,
      email: string,
      id: string,
      joinedAt?: number | null,
      lastLogin?: number | null,
      owner?: string | null,
      profilePic?: string | null,
      updatedAt: string,
    } | null,
    businessOwnerId?: string | null,
    category: string,
    city: string,
    country: string,
    createdAt: string,
    description: string,
    email: string,
    id: string,
    location?:  {
      __typename: "BusinessLocation",
      lattitude?: number | null,
      longitude?: number | null,
    } | null,
    name: string,
    owner?: string | null,
    phoneNumber: string,
    photos?: Array< string | null > | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    state: string,
    streetAddress: string,
    updatedAt: string,
    website?: string | null,
    zipcode: string,
  } | null,
};

export type GetReviewQueryVariables = {
  id: string,
};

export type GetReviewQuery = {
  getReview?:  {
    __typename: "Review",
    business?:  {
      __typename: "Business",
      aptSuiteOther?: string | null,
      averageRating?: number | null,
      businessHours?: string | null,
      businessOwnerId?: string | null,
      category: string,
      city: string,
      country: string,
      createdAt: string,
      description: string,
      email: string,
      id: string,
      name: string,
      owner?: string | null,
      phoneNumber: string,
      photos?: Array< string | null > | null,
      state: string,
      streetAddress: string,
      updatedAt: string,
      website?: string | null,
      zipcode: string,
    } | null,
    businessId?: string | null,
    content: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    rating: number,
    reviewDate?: number | null,
    updatedAt: string,
    user?:  {
      __typename: "User",
      createdAt: string,
      email: string,
      id: string,
      joinedAt?: number | null,
      lastLogin?: number | null,
      owner?: string | null,
      profilePic?: string | null,
      updatedAt: string,
    } | null,
    userId?: string | null,
  } | null,
};

export type GetUserQueryVariables = {
  id: string,
};

export type GetUserQuery = {
  getUser?:  {
    __typename: "User",
    businesses?:  {
      __typename: "ModelBusinessConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    email: string,
    id: string,
    joinedAt?: number | null,
    lastLogin?: number | null,
    name?:  {
      __typename: "UserName",
      firstName: string,
      lastName: string,
    } | null,
    owner?: string | null,
    profilePic?: string | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type ListBusinessesQueryVariables = {
  filter?: ModelBusinessFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListBusinessesQuery = {
  listBusinesses?:  {
    __typename: "ModelBusinessConnection",
    items:  Array< {
      __typename: "Business",
      aptSuiteOther?: string | null,
      averageRating?: number | null,
      businessHours?: string | null,
      businessOwnerId?: string | null,
      category: string,
      city: string,
      country: string,
      createdAt: string,
      description: string,
      email: string,
      id: string,
      name: string,
      owner?: string | null,
      phoneNumber: string,
      photos?: Array< string | null > | null,
      state: string,
      streetAddress: string,
      updatedAt: string,
      website?: string | null,
      zipcode: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListReviewsQueryVariables = {
  filter?: ModelReviewFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListReviewsQuery = {
  listReviews?:  {
    __typename: "ModelReviewConnection",
    items:  Array< {
      __typename: "Review",
      businessId?: string | null,
      content: string,
      createdAt: string,
      id: string,
      owner?: string | null,
      rating: number,
      reviewDate?: number | null,
      updatedAt: string,
      userId?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListUsersQueryVariables = {
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUsersQuery = {
  listUsers?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      createdAt: string,
      email: string,
      id: string,
      joinedAt?: number | null,
      lastLogin?: number | null,
      owner?: string | null,
      profilePic?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type CreateBusinessMutationVariables = {
  condition?: ModelBusinessConditionInput | null,
  input: CreateBusinessInput,
};

export type CreateBusinessMutation = {
  createBusiness?:  {
    __typename: "Business",
    aptSuiteOther?: string | null,
    averageRating?: number | null,
    businessHours?: string | null,
    businessOwner?:  {
      __typename: "User",
      createdAt: string,
      email: string,
      id: string,
      joinedAt?: number | null,
      lastLogin?: number | null,
      owner?: string | null,
      profilePic?: string | null,
      updatedAt: string,
    } | null,
    businessOwnerId?: string | null,
    category: string,
    city: string,
    country: string,
    createdAt: string,
    description: string,
    email: string,
    id: string,
    location?:  {
      __typename: "BusinessLocation",
      lattitude?: number | null,
      longitude?: number | null,
    } | null,
    name: string,
    owner?: string | null,
    phoneNumber: string,
    photos?: Array< string | null > | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    state: string,
    streetAddress: string,
    updatedAt: string,
    website?: string | null,
    zipcode: string,
  } | null,
};

export type CreateReviewMutationVariables = {
  condition?: ModelReviewConditionInput | null,
  input: CreateReviewInput,
};

export type CreateReviewMutation = {
  createReview?:  {
    __typename: "Review",
    business?:  {
      __typename: "Business",
      aptSuiteOther?: string | null,
      averageRating?: number | null,
      businessHours?: string | null,
      businessOwnerId?: string | null,
      category: string,
      city: string,
      country: string,
      createdAt: string,
      description: string,
      email: string,
      id: string,
      name: string,
      owner?: string | null,
      phoneNumber: string,
      photos?: Array< string | null > | null,
      state: string,
      streetAddress: string,
      updatedAt: string,
      website?: string | null,
      zipcode: string,
    } | null,
    businessId?: string | null,
    content: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    rating: number,
    reviewDate?: number | null,
    updatedAt: string,
    user?:  {
      __typename: "User",
      createdAt: string,
      email: string,
      id: string,
      joinedAt?: number | null,
      lastLogin?: number | null,
      owner?: string | null,
      profilePic?: string | null,
      updatedAt: string,
    } | null,
    userId?: string | null,
  } | null,
};

export type CreateUserMutationVariables = {
  condition?: ModelUserConditionInput | null,
  input: CreateUserInput,
};

export type CreateUserMutation = {
  createUser?:  {
    __typename: "User",
    businesses?:  {
      __typename: "ModelBusinessConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    email: string,
    id: string,
    joinedAt?: number | null,
    lastLogin?: number | null,
    name?:  {
      __typename: "UserName",
      firstName: string,
      lastName: string,
    } | null,
    owner?: string | null,
    profilePic?: string | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type DeleteBusinessMutationVariables = {
  condition?: ModelBusinessConditionInput | null,
  input: DeleteBusinessInput,
};

export type DeleteBusinessMutation = {
  deleteBusiness?:  {
    __typename: "Business",
    aptSuiteOther?: string | null,
    averageRating?: number | null,
    businessHours?: string | null,
    businessOwner?:  {
      __typename: "User",
      createdAt: string,
      email: string,
      id: string,
      joinedAt?: number | null,
      lastLogin?: number | null,
      owner?: string | null,
      profilePic?: string | null,
      updatedAt: string,
    } | null,
    businessOwnerId?: string | null,
    category: string,
    city: string,
    country: string,
    createdAt: string,
    description: string,
    email: string,
    id: string,
    location?:  {
      __typename: "BusinessLocation",
      lattitude?: number | null,
      longitude?: number | null,
    } | null,
    name: string,
    owner?: string | null,
    phoneNumber: string,
    photos?: Array< string | null > | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    state: string,
    streetAddress: string,
    updatedAt: string,
    website?: string | null,
    zipcode: string,
  } | null,
};

export type DeleteReviewMutationVariables = {
  condition?: ModelReviewConditionInput | null,
  input: DeleteReviewInput,
};

export type DeleteReviewMutation = {
  deleteReview?:  {
    __typename: "Review",
    business?:  {
      __typename: "Business",
      aptSuiteOther?: string | null,
      averageRating?: number | null,
      businessHours?: string | null,
      businessOwnerId?: string | null,
      category: string,
      city: string,
      country: string,
      createdAt: string,
      description: string,
      email: string,
      id: string,
      name: string,
      owner?: string | null,
      phoneNumber: string,
      photos?: Array< string | null > | null,
      state: string,
      streetAddress: string,
      updatedAt: string,
      website?: string | null,
      zipcode: string,
    } | null,
    businessId?: string | null,
    content: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    rating: number,
    reviewDate?: number | null,
    updatedAt: string,
    user?:  {
      __typename: "User",
      createdAt: string,
      email: string,
      id: string,
      joinedAt?: number | null,
      lastLogin?: number | null,
      owner?: string | null,
      profilePic?: string | null,
      updatedAt: string,
    } | null,
    userId?: string | null,
  } | null,
};

export type DeleteUserMutationVariables = {
  condition?: ModelUserConditionInput | null,
  input: DeleteUserInput,
};

export type DeleteUserMutation = {
  deleteUser?:  {
    __typename: "User",
    businesses?:  {
      __typename: "ModelBusinessConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    email: string,
    id: string,
    joinedAt?: number | null,
    lastLogin?: number | null,
    name?:  {
      __typename: "UserName",
      firstName: string,
      lastName: string,
    } | null,
    owner?: string | null,
    profilePic?: string | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type UpdateBusinessMutationVariables = {
  condition?: ModelBusinessConditionInput | null,
  input: UpdateBusinessInput,
};

export type UpdateBusinessMutation = {
  updateBusiness?:  {
    __typename: "Business",
    aptSuiteOther?: string | null,
    averageRating?: number | null,
    businessHours?: string | null,
    businessOwner?:  {
      __typename: "User",
      createdAt: string,
      email: string,
      id: string,
      joinedAt?: number | null,
      lastLogin?: number | null,
      owner?: string | null,
      profilePic?: string | null,
      updatedAt: string,
    } | null,
    businessOwnerId?: string | null,
    category: string,
    city: string,
    country: string,
    createdAt: string,
    description: string,
    email: string,
    id: string,
    location?:  {
      __typename: "BusinessLocation",
      lattitude?: number | null,
      longitude?: number | null,
    } | null,
    name: string,
    owner?: string | null,
    phoneNumber: string,
    photos?: Array< string | null > | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    state: string,
    streetAddress: string,
    updatedAt: string,
    website?: string | null,
    zipcode: string,
  } | null,
};

export type UpdateReviewMutationVariables = {
  condition?: ModelReviewConditionInput | null,
  input: UpdateReviewInput,
};

export type UpdateReviewMutation = {
  updateReview?:  {
    __typename: "Review",
    business?:  {
      __typename: "Business",
      aptSuiteOther?: string | null,
      averageRating?: number | null,
      businessHours?: string | null,
      businessOwnerId?: string | null,
      category: string,
      city: string,
      country: string,
      createdAt: string,
      description: string,
      email: string,
      id: string,
      name: string,
      owner?: string | null,
      phoneNumber: string,
      photos?: Array< string | null > | null,
      state: string,
      streetAddress: string,
      updatedAt: string,
      website?: string | null,
      zipcode: string,
    } | null,
    businessId?: string | null,
    content: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    rating: number,
    reviewDate?: number | null,
    updatedAt: string,
    user?:  {
      __typename: "User",
      createdAt: string,
      email: string,
      id: string,
      joinedAt?: number | null,
      lastLogin?: number | null,
      owner?: string | null,
      profilePic?: string | null,
      updatedAt: string,
    } | null,
    userId?: string | null,
  } | null,
};

export type UpdateUserMutationVariables = {
  condition?: ModelUserConditionInput | null,
  input: UpdateUserInput,
};

export type UpdateUserMutation = {
  updateUser?:  {
    __typename: "User",
    businesses?:  {
      __typename: "ModelBusinessConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    email: string,
    id: string,
    joinedAt?: number | null,
    lastLogin?: number | null,
    name?:  {
      __typename: "UserName",
      firstName: string,
      lastName: string,
    } | null,
    owner?: string | null,
    profilePic?: string | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnCreateBusinessSubscriptionVariables = {
  filter?: ModelSubscriptionBusinessFilterInput | null,
  owner?: string | null,
};

export type OnCreateBusinessSubscription = {
  onCreateBusiness?:  {
    __typename: "Business",
    aptSuiteOther?: string | null,
    averageRating?: number | null,
    businessHours?: string | null,
    businessOwner?:  {
      __typename: "User",
      createdAt: string,
      email: string,
      id: string,
      joinedAt?: number | null,
      lastLogin?: number | null,
      owner?: string | null,
      profilePic?: string | null,
      updatedAt: string,
    } | null,
    businessOwnerId?: string | null,
    category: string,
    city: string,
    country: string,
    createdAt: string,
    description: string,
    email: string,
    id: string,
    location?:  {
      __typename: "BusinessLocation",
      lattitude?: number | null,
      longitude?: number | null,
    } | null,
    name: string,
    owner?: string | null,
    phoneNumber: string,
    photos?: Array< string | null > | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    state: string,
    streetAddress: string,
    updatedAt: string,
    website?: string | null,
    zipcode: string,
  } | null,
};

export type OnCreateReviewSubscriptionVariables = {
  filter?: ModelSubscriptionReviewFilterInput | null,
  owner?: string | null,
};

export type OnCreateReviewSubscription = {
  onCreateReview?:  {
    __typename: "Review",
    business?:  {
      __typename: "Business",
      aptSuiteOther?: string | null,
      averageRating?: number | null,
      businessHours?: string | null,
      businessOwnerId?: string | null,
      category: string,
      city: string,
      country: string,
      createdAt: string,
      description: string,
      email: string,
      id: string,
      name: string,
      owner?: string | null,
      phoneNumber: string,
      photos?: Array< string | null > | null,
      state: string,
      streetAddress: string,
      updatedAt: string,
      website?: string | null,
      zipcode: string,
    } | null,
    businessId?: string | null,
    content: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    rating: number,
    reviewDate?: number | null,
    updatedAt: string,
    user?:  {
      __typename: "User",
      createdAt: string,
      email: string,
      id: string,
      joinedAt?: number | null,
      lastLogin?: number | null,
      owner?: string | null,
      profilePic?: string | null,
      updatedAt: string,
    } | null,
    userId?: string | null,
  } | null,
};

export type OnCreateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
  owner?: string | null,
};

export type OnCreateUserSubscription = {
  onCreateUser?:  {
    __typename: "User",
    businesses?:  {
      __typename: "ModelBusinessConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    email: string,
    id: string,
    joinedAt?: number | null,
    lastLogin?: number | null,
    name?:  {
      __typename: "UserName",
      firstName: string,
      lastName: string,
    } | null,
    owner?: string | null,
    profilePic?: string | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteBusinessSubscriptionVariables = {
  filter?: ModelSubscriptionBusinessFilterInput | null,
  owner?: string | null,
};

export type OnDeleteBusinessSubscription = {
  onDeleteBusiness?:  {
    __typename: "Business",
    aptSuiteOther?: string | null,
    averageRating?: number | null,
    businessHours?: string | null,
    businessOwner?:  {
      __typename: "User",
      createdAt: string,
      email: string,
      id: string,
      joinedAt?: number | null,
      lastLogin?: number | null,
      owner?: string | null,
      profilePic?: string | null,
      updatedAt: string,
    } | null,
    businessOwnerId?: string | null,
    category: string,
    city: string,
    country: string,
    createdAt: string,
    description: string,
    email: string,
    id: string,
    location?:  {
      __typename: "BusinessLocation",
      lattitude?: number | null,
      longitude?: number | null,
    } | null,
    name: string,
    owner?: string | null,
    phoneNumber: string,
    photos?: Array< string | null > | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    state: string,
    streetAddress: string,
    updatedAt: string,
    website?: string | null,
    zipcode: string,
  } | null,
};

export type OnDeleteReviewSubscriptionVariables = {
  filter?: ModelSubscriptionReviewFilterInput | null,
  owner?: string | null,
};

export type OnDeleteReviewSubscription = {
  onDeleteReview?:  {
    __typename: "Review",
    business?:  {
      __typename: "Business",
      aptSuiteOther?: string | null,
      averageRating?: number | null,
      businessHours?: string | null,
      businessOwnerId?: string | null,
      category: string,
      city: string,
      country: string,
      createdAt: string,
      description: string,
      email: string,
      id: string,
      name: string,
      owner?: string | null,
      phoneNumber: string,
      photos?: Array< string | null > | null,
      state: string,
      streetAddress: string,
      updatedAt: string,
      website?: string | null,
      zipcode: string,
    } | null,
    businessId?: string | null,
    content: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    rating: number,
    reviewDate?: number | null,
    updatedAt: string,
    user?:  {
      __typename: "User",
      createdAt: string,
      email: string,
      id: string,
      joinedAt?: number | null,
      lastLogin?: number | null,
      owner?: string | null,
      profilePic?: string | null,
      updatedAt: string,
    } | null,
    userId?: string | null,
  } | null,
};

export type OnDeleteUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
  owner?: string | null,
};

export type OnDeleteUserSubscription = {
  onDeleteUser?:  {
    __typename: "User",
    businesses?:  {
      __typename: "ModelBusinessConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    email: string,
    id: string,
    joinedAt?: number | null,
    lastLogin?: number | null,
    name?:  {
      __typename: "UserName",
      firstName: string,
      lastName: string,
    } | null,
    owner?: string | null,
    profilePic?: string | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateBusinessSubscriptionVariables = {
  filter?: ModelSubscriptionBusinessFilterInput | null,
  owner?: string | null,
};

export type OnUpdateBusinessSubscription = {
  onUpdateBusiness?:  {
    __typename: "Business",
    aptSuiteOther?: string | null,
    averageRating?: number | null,
    businessHours?: string | null,
    businessOwner?:  {
      __typename: "User",
      createdAt: string,
      email: string,
      id: string,
      joinedAt?: number | null,
      lastLogin?: number | null,
      owner?: string | null,
      profilePic?: string | null,
      updatedAt: string,
    } | null,
    businessOwnerId?: string | null,
    category: string,
    city: string,
    country: string,
    createdAt: string,
    description: string,
    email: string,
    id: string,
    location?:  {
      __typename: "BusinessLocation",
      lattitude?: number | null,
      longitude?: number | null,
    } | null,
    name: string,
    owner?: string | null,
    phoneNumber: string,
    photos?: Array< string | null > | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    state: string,
    streetAddress: string,
    updatedAt: string,
    website?: string | null,
    zipcode: string,
  } | null,
};

export type OnUpdateReviewSubscriptionVariables = {
  filter?: ModelSubscriptionReviewFilterInput | null,
  owner?: string | null,
};

export type OnUpdateReviewSubscription = {
  onUpdateReview?:  {
    __typename: "Review",
    business?:  {
      __typename: "Business",
      aptSuiteOther?: string | null,
      averageRating?: number | null,
      businessHours?: string | null,
      businessOwnerId?: string | null,
      category: string,
      city: string,
      country: string,
      createdAt: string,
      description: string,
      email: string,
      id: string,
      name: string,
      owner?: string | null,
      phoneNumber: string,
      photos?: Array< string | null > | null,
      state: string,
      streetAddress: string,
      updatedAt: string,
      website?: string | null,
      zipcode: string,
    } | null,
    businessId?: string | null,
    content: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    rating: number,
    reviewDate?: number | null,
    updatedAt: string,
    user?:  {
      __typename: "User",
      createdAt: string,
      email: string,
      id: string,
      joinedAt?: number | null,
      lastLogin?: number | null,
      owner?: string | null,
      profilePic?: string | null,
      updatedAt: string,
    } | null,
    userId?: string | null,
  } | null,
};

export type OnUpdateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
  owner?: string | null,
};

export type OnUpdateUserSubscription = {
  onUpdateUser?:  {
    __typename: "User",
    businesses?:  {
      __typename: "ModelBusinessConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    email: string,
    id: string,
    joinedAt?: number | null,
    lastLogin?: number | null,
    name?:  {
      __typename: "UserName",
      firstName: string,
      lastName: string,
    } | null,
    owner?: string | null,
    profilePic?: string | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};
