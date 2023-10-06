import React from 'react';

function UserInfoSkeleton() {
  return (
    <div className="flex items-center justify-center h-128 w-full mb-10 mt-10">
      <div className="w-96 h-128 overflow-hidden shadow-xl">
        <div className="bg-white rounded-lg border">
          <div className="photo-wrapper p-2">
            <div className="w-32 h-32 rounded-full mx-auto bg-gray-300 animate-pulse"></div>
          </div>
          <div className="p-2">
            <div className="h-5 bg-gray-300 animate-pulse mb-2"></div>
            <div className="h-3 w-3/4 mx-auto bg-gray-300 animate-pulse mb-3"></div>
            <table className="text-xs my-3">
              <tbody>
                <tr>
                  <td className="px-2 py-2 w-1/3 bg-gray-300 animate-pulse"></td>
                  <td className="px-2 py-2 w-2/3 bg-gray-300 animate-pulse"></td>
                </tr>
                <tr>
                  <td className="px-2 py-2 w-1/3 bg-gray-300 animate-pulse"></td>
                  <td className="px-2 py-2 w-2/3 bg-gray-300 animate-pulse"></td>
                </tr>
                <tr>
                  <td className="px-2 py-2 w-1/3 bg-gray-300 animate-pulse"></td>
                  <td className="px-2 py-2 w-2/3 bg-gray-300 animate-pulse"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
function UserBookingsSkeleton() {
  return (
    <div className="border bg-white shadow-md p-5 rounded-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
        Your Reservations
      </h3>
      <ul className="flex flex-wrap gap-2">
        {/* Let's add, say, 4 skeleton bookings for illustration purposes */}
        {[...Array(4)].map((_, index) => (
          <li key={index} className="text-black-600 py-5 rounded-full text-sm">
            <div className="h-16 w-64 bg-gray-300 rounded"></div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function UserProfileSkeleton() {
  return (
    <>
      <UserInfoSkeleton />

      <div className="flex gap-6">
        <UserBookingsSkeleton />

        <UserBookingsSkeleton />
      </div>
    </>
  );
}

export default function Loading() {
  return (
    <main>
      <UserProfileSkeleton />
      {/* <UserInfoSkeleton />
      <UserBookingsSkeleton /> */}
    </main>
  );
}
