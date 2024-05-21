"use client";
import React, { useEffect, useRef } from "react";
import { UserState, useUser } from "./user";

export default function InitUser({ user }: { user: UserState["user"] }) {
  const initState = useRef(false);

  useEffect(() => {
    if (!initState.current) {
      useUser.setState({ user });
    }
    initState.current = true;
    // eslint-disable-next-line
  }, []);

  return <></>;
}
