'use client';
import React, { useState } from 'react';
import axios from 'axios';

export default function UserInfo({
  user,
}: {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    city: string;
  };
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [email, setEmail] = useState(user.email);
  const [city, setCity] = useState(user.city);
  const [phone, setPhone] = useState(user.phone);

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };
  const saveChanges = async () => {
    try {
      const response = await axios.patch(`/api/auth/updateProfile`, {
        id: user.id,
        firstName,
        lastName,
        email,
        city,
        phone,
        password: undefined,
      });
      toggleEditMode();
    } catch (error) {
      // Handle error: show an error message to the user
    }
  };

  return (
    <div className="flex items-center justify-center h-128 w-full mb-10 mt-10">
      <div className="w-full">
        <div className="bg-white rounded-lg border">
          <div className="photo-wrapper p-2">
            <img
              className="w-32 h-32 rounded-full mx-auto object-cover"
              src="https://www.gravatar.com/avatar/2acfb745ecf9d4dccb3364752d17f65f?s=260&d=mp"
              alt="John Doe"
            />
          </div>
          <div className="p-2">
            <h3 className="text-center text-xl text-gray-900 font-medium leading-8">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    className="bg-white p-1 border rounded"
                  />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    className="bg-white p-1 border rounded ml-2"
                  />
                </>
              ) : (
                `${firstName} ${lastName}`
              )}
            </h3>
            <table className="text-xs my-3">
              <tbody>
                <tr>
                  <td className="px-2 py-2 text-gray-500 font-semibold">
                    City
                  </td>
                  <td className="px-2 py-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                        className="bg-white p-1 border rounded"
                      />
                    ) : (
                      city
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-2 py-2 text-gray-500 font-semibold">
                    Phone
                  </td>
                  <td className="px-2 py-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone"
                        className="bg-white p-1 border rounded"
                      />
                    ) : (
                      phone
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-2 py-2 text-gray-500 font-semibold">
                    Email
                  </td>
                  <td className="px-2 py-2">
                    {isEditing ? (
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="bg-white p-1 border rounded"
                      />
                    ) : (
                      email
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="text-center my-3">
              <button
                className="text-xs text-indigo-500 hover:underline hover:text-indigo-600 font-medium"
                onClick={isEditing ? saveChanges : toggleEditMode}
              >
                {isEditing ? 'Save' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
