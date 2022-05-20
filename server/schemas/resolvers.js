const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    // get single user
    // get a single user by either their id or their username
    me: async (parent, args, context) => {
      console.log(context.user);
      const foundUser = await User.findOne({ _id: context.user._id });

      return foundUser;
    },
  },

  Mutation: {
    // add user
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },

    // save book
    saveBook: async (parent, { input }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user.id },
          { $addToSet: { savedBooks: input } },
          { new: true }
        );
        return updatedUser;
      }
    },

    // login
    login: async (parent, { email, password }) => {
      const user = await User.findOne({
        $or: [{ username: username }, { email: email }],
      });

      const correctPw = await user.isCorrectPassword(user.password);

      const token = signToken(user);
      return { token, user };
    },

    // remove book
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user.id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );

        return updatedUser;
      }
    },
  },
};

module.exports = resolvers;
