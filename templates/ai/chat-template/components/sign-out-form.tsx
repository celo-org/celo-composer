import Form from "next/form";

// Auth disabled

export const SignOutForm = () => {
  return (
    <Form
      className="w-full"
      action={async () => {
        "use server";

        window.location.href = "/";
      }}
    >
      <button
        type="submit"
        className="w-full text-left px-1 py-0.5 text-red-500"
      >
        Sign out
      </button>
    </Form>
  );
};
