import { generateClient } from 'aws-amplify/data';

/**
 * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
 */
const client = generateClient();

export class Business {
    constructor({
      businessOwnerId,
      businessOwner = null,
      name,
      email,
      phoneNumber,
      website = null,
      category,
      streetAddress,
      aptSuiteOther = null,
      city,
      state,
      zipcode,
      country,
      location = { latitude: null, longitude: null },
      businessHours = {},
      description,
      photos = [],
      averageRating = null,
      reviews = []
    }) {
      this.businessOwnerId = businessOwnerId;
      this.businessOwner = businessOwner;
      this.name = name;
      this.email = email;
      this.phoneNumber = phoneNumber;
      this.website = website;
      this.category = category;
      this.streetAddress = streetAddress;
      this.aptSuiteOther = aptSuiteOther;
      this.city = city;
      this.state = state;
      this.zipcode = zipcode;
      this.country = country;
      this.location = location;
      this.businessHours = businessHours;
      this.description = description;
      this.photos = photos;
      this.averageRating = averageRating;
      this.reviews = reviews;
    }
  }

  export class User {
    constructor({ firstName, lastName, email, profilePic = null, joinedAt = null, lastLogin = null, reviews = [], businesses = [] }) {
      this.name = {
        firstName: firstName,
        lastName: lastName
      };
      this.email = email;
      this.profilePic = profilePic;
      this.joinedAt = joinedAt ? new Date(joinedAt) : new Date();
      this.lastLogin = lastLogin ? new Date(lastLogin) : null;
      this.reviews = reviews;
      this.businesses = businesses;
    }
  
    getFullName() {
      return `${this.name.firstName} ${this.name.lastName}`;
    }
  }

  export class Review {
    constructor({ businessId, business = null, userId, user = null, rating, content, reviewDate = null }) {
      this.businessId = businessId;
      this.business = business;
      this.userId = userId;
      this.user = user;
      this.rating = rating;
      this.content = content;
      this.reviewDate = reviewDate ? new Date(reviewDate) : new Date();
    }
  }