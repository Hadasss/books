const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    // get single user
    // get a single user by either their id or their username
    // QUESTION - how to use the data object with args and context
    me: async (parent, args, context) => {
      const foundUser = await User.findOne({
        $or: [
          { _id: context.user ? context.user._id : args.user.id },
          { username: args.user.username },
        ],
      });

      if (!foundUser) {
        // QUESTION - what replaces res to display a message?
        return res
          .status(400)
          .json({ message: "Cannot find a user with this id!" });
      }

      res.json(foundUser);
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
      return res.json({ message: "You need to be logged in!" });
    },

    // login
    login: async (parent, { email, password }) => {
      const user = await User.findOne({
        $or: [{ username: username }, { email: email }],
      });

      if (!user) {
        return res.status(400).json({ message: "Can't find this user" });
      }

      const correctPw = await user.isCorrectPassword(user.password);

      if (!correctPw) {
        return res.status(400).json({ message: "Wrong password!" });
      }
      const token = signToken(user);
      res.json({ token, user });
    },

    // remove book
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        // findOneAndUpdate OR findOneByIdAndUpdate ??
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user.id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );

        return updatedUser;
      }

      return res
        .status(400)
        .json({ message: "No book was found with this id" });
    },
  },
};

module.exports = resolvers;
