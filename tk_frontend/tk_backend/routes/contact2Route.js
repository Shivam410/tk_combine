import express from "express";
import { deleteContact, getAllContacts, getSingleContact, newContact } from "../controllers/Contact2Controller.js";



const router = express.Router();

router.post("/new-contact2" , newContact);

router.get("/all-contact2" , getAllContacts);

router.get("/contact-2/:id" , getSingleContact);

router.delete("/contact-2/:id" , deleteContact);






export default router;
