import { FilterQuery, QueryOptions } from 'mongoose';
import User, { IUser } from '../../model/user';
import config from 'config';

interface UpdateData {
  password?: string
}

// CreateUser service
export const createUser = async (input: Partial<IUser>) => {
  const { fullName, email, password, emailVerificationTokenExpiresAt } = input
  const user = await User.create({
    fullName,
    email,
    password,
    emailVerificationTokenExpiresAt
  });
  return user
};

// Find User by Id
export const findUserById = async (id: string) => {
  const user = await User.findById(id).lean();
  return user;
};

// Find User by Id and update
export const findUserAndUpdate = async (id: string, updateData?: UpdateData) => {
  const update = { ...(updateData || {}), isVerified: true };
  const user = await User.findOneAndUpdate(
    { _id: id },
    update,
    { new: true, lean: true } 
  );
  
  // Convert plain JavaScript object to mongoose document
  const userDocument = new User(user);

  return userDocument;
};


// Find All users
export const findAllUsers = async () => {
  return await User.find();
};

// Find one user by any fields
export const findUser = async (
    query: FilterQuery<IUser>,
    options: QueryOptions = {}
  ): Promise<IUser | null> => {
    return await User.findOne(query, {}, options).select('+password').lean();
  };

  export const deleteUserById = async (id: string) => {
    const user = await User.findByIdAndDelete(id).lean();
    return user;
  };
  