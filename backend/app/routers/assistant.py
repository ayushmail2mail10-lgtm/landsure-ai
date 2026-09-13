import re
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.document import Document
from app.models.validation import ValidationResult
from app.schemas.assistant import AssistantChatRequest, AssistantChatResponse

router = APIRouter(prefix="/assistant", tags=["Land AI Assistant"])

@router.post("/chat", response_model=AssistantChatResponse)
def chat_with_land_assistant(req: AssistantChatRequest, db: Session = Depends(get_db)):
    msg = req.message.lower().strip()
    lang = req.language or "en"

    # Contextual analysis if document_id is provided
    doc_context = ""
    if req.context_document_id:
        doc = db.query(Document).filter(Document.id == req.context_document_id).first()
        if doc:
            val = db.query(ValidationResult).filter(ValidationResult.document_id == doc.id).first()
            if val:
                doc_context = f" Document #{doc.document_number} has Validation Score: {val.overall_validation_score}%, Fraud Score: {val.fraud_risk_score}%, and AI Analysis: '{val.ai_explanation}'."

    # Multilingual responses
    if "survey" in msg or "खसरा" in msg or "सर्व्हे" in msg or "gut" in msg:
        if lang == "mr":
            reply = f"सर्व्हे नंबर (किंवा गट नंबर) हा महसूल विभागाद्वारे जमिनीच्या विशिष्ट तुकड्याला दिलेला अनन्य ओळख क्रमांक आहे. हा नकाशावर जमिनीचे अचूक क्षेत्र आणि सीमा दर्शवितो.{doc_context}"
        elif lang == "hi":
            reply = f"सर्वे नंबर (या खसरा नंबर) राजस्व विभाग द्वारा दिए जाने वाला एक विशिष्ट भूखंड पहचान संख्या है। यह भूमि के सटीक क्षेत्रफल और सीमा को दर्शाता है।{doc_context}"
        else:
            reply = f"A Survey Number (or Khasra/Gut Number) is a unique cadastral parcel identifier assigned by the Revenue Department to designate specific geo-referenced boundaries and land area.{doc_context}"

    elif "mutation" in msg or "ferfar" in msg or "फेरफार" in msg or "नामांतरण" in msg:
        if lang == "mr":
            reply = f"फेरफार (Mutation) म्हणजे जमिनीच्या मालकी हक्कात किंवा महसूल नोंदीत झालेला अधिकृत बदल (उदा. खरेदी, वारस नोंद, वाटप). फेरफार मंजूर झाल्यावरच सातबारावर नवीन नाव लागते.{doc_context}"
        elif lang == "hi":
            reply = f"नामांतरण (दाखिल-खारिज/Mutation) वह कानूनी प्रक्रिया है जिसके द्वारा भूमि के स्वामित्व का हस्तांतरण सरकारी राजस्व रिकॉर्ड (खतौनी) में दर्ज किया जाता है।{doc_context}"
        else:
            reply = f"Mutation (Ferfar / Dakhil-Kharij) is the formal statutory process through which title ownership is legally updated in revenue records following sale, inheritance, gift, or partition.{doc_context}"

    elif "7/12" in msg or "satbara" in msg or "सातबारा" in msg or "khatauni" in msg or "खतौनी" in msg:
        if lang == "mr":
            reply = f"७/१२ (सातबारा) उतारा हा महाराष्ट्र जमीन महसूल संहितेनुसार जमिनीचा हक्क व पीक पाहणी दर्शविणारा अधिकृत उतारा आहे. यात खातेदाराचे नाव, एकूण क्षेत्र, भोगवटादार वर्ग आणि इतर हक्क नमूद असतात.{doc_context}"
        elif lang == "hi":
            reply = f"खतौनी (या 7/12) राजस्व अभिलेख है जो भूस्वामी के अधिकार, खसरा संख्या और क्षेत्रफल को प्रमाणित करता है।{doc_context}"
        else:
            reply = f"The 7/12 Extract (Record of Rights / Khatauni) is an authentic government revenue register displaying ownership title, cadastral survey boundaries, land tenure classification, and encumbrances.{doc_context}"

    elif "flag" in msg or "discrepancy" in msg or "fraud" in msg or "तफावत" in msg or "संशयास्पद" in msg or "गलती" in msg:
        if doc_context:
            reply = f"Current Document Status: {doc_context} If your document was flagged, verify that the spelling of the title holder matches your registered sale deed and that the disclosed area matches the official revenue map."
        else:
            reply = "Records are flagged when our AI Validation Engine detects inconsistencies such as name spelling deviations, survey number mismatches, land area inflation, or broken mutation chains against the official cadastral database."

    elif "tamper" in msg or "hash" in msg or "सुरक्षा" in msg:
        reply = "LandSure AI computes an immutable SHA-256 cryptographic hash of each uploaded document. If even a single byte or pixel is altered post-certification, our integrity verifier instantly flags '⚠ Document Modified / Tampered'."

    else:
        if lang == "mr":
            reply = f"नमस्कार! मी LandSure AI महसूल सहाय्यक आहे. मी तुम्हाला सातबारा, फेरफार, सर्व्हे नंबर आणि जमिनीच्या पडताळणी प्रक्रियेबद्दल मदत करू शकतो. {doc_context}"
        elif lang == "hi":
            reply = f"नमस्ते! मैं LandSure AI का राजस्व सहायक हूँ। मैं आपको 7/12, खतौनी, दाखिल-खारिज और भूमि सत्यापन संबंधी प्रश्नों में मदद कर सकता हूँ। {doc_context}"
        else:
            reply = f"Hello! I am LandSure AI's intelligent Land & Revenue Assistant. I can assist you with 7/12 extracts, Khatauni, Survey numbers, Mutation processes, and explain discrepancy flags.{doc_context}"

    suggested = [
        "What is a Survey Number?",
        "How does Mutation (Ferfar) work?",
        "Why was my land record flagged?",
        "How does SHA-256 tamper detection protect my title?"
    ]

    return {
        "reply": reply,
        "suggested_queries": suggested
    }
