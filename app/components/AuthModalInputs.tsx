interface Props {
  inputs: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    city: string;
    password: string;
  };
  handleChangeInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSignIn: boolean;
}

export default function AuthModalInputs({
  inputs,
  handleChangeInput,
  isSignIn,
}: Props) {
  return (
    <div>
      {isSignIn ? null : (
        <div className="my-3 justify-between text-sm  text-white">
          <input
            type="text"
            className="border bg-white text-black rounded p-2 w-[49%]"
            // className="border rounded p-2 w-[49%]"
            placeholder="First Name"
            value={inputs.firstName}
            onChange={handleChangeInput}
            name={'firstName'}
          />
          <input
            type="text"
            className="border bg-white text-black rounded p-2 w-[49%]"
            placeholder="Last Name"
            value={inputs.lastName}
            onChange={handleChangeInput}
            name={'lastName'}
          />
        </div>
      )}
      <div className="my-3 justify-between text-sm  text-white">
        <input
          type="text"
          className="border bg-white text-black rounded p-2 w-full"
          placeholder="Email"
          value={inputs.email}
          onChange={handleChangeInput}
          name={'email'}
        />
      </div>
      {isSignIn ? null : (
        <div className="my-3 justify-between text-sm  text-white">
          <input
            type="text"
            className="border bg-white text-black rounded p-2 w-[49%]"
            placeholder="Phone Number"
            value={inputs.phoneNumber}
            onChange={handleChangeInput}
            name={'phoneNumber'}
          />
          <input
            type="text"
            className="border bg-white text-black rounded p-2 w-[49%]"
            placeholder="City"
            value={inputs.city}
            onChange={handleChangeInput}
            name={'city'}
          />
        </div>
      )}
      <div className="my-3 justify-between text-sm  text-white">
        <input
          type="password"
          className="border bg-white text-black rounded p-2 w-full"
          placeholder="Password"
          value={inputs.password}
          onChange={handleChangeInput}
          name={'password'}
        />
      </div>
    </div>
  );
}
