import express from "express";
import { deleteSingleContact, getAllContacts, getSingleContact, newContact } from "../controllers/ContactController.js";


const router = express.Router();

router.post("/submit-contact", newContact);

router.get("/all-contacts", getAllContacts);

router.get("/:id", getSingleContact);

router.delete("/:id", deleteSingleContact);


export default router;
