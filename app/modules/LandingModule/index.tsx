import React, { useEffect } from "react";
import { Form, redirect, useLoaderData, useNavigate } from "react-router";

import { Button } from "~/components/ui/button";

export const LandingModule = () => {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center">
      <div className="flex flex-col">
        <p>Landing Page</p>
        <Button variant="transparentWhite" size="default">Test</Button>
      </div>
      {/* {user ? (
        <Form method="post">
          <button type="submit">Sign Out</button>
        </Form>
      ) : (
        ""
      )} */}
    </main>
  );
};
