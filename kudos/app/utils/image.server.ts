import {
    unstable_parseMultipartFormData,
    UploadHandler,
  } from "@remix-run/node";

import fs from "fs";

import { createId } from "@paralleldrive/cuid2";

const uploadHandler: UploadHandler = async ({ filename, name, stream }) => {
    // 2
    if (name !== "profile-pic") {
      stream.resume();
      return;
    }
  
    // 3
    const location:string = '/Users/' + createId() + '/img/' + filename;
    
    
    fs.writeFile(location, stream, err => {
        if (err) {
        console.error(err);
        }
        });

    // 4
    return location;
  };