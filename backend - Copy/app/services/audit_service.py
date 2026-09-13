from sqlalchemy.orm import Session
from app.models.audit import AuditLog

def record_audit_log(
    db: Session,
    user_id: int = None,
    username: str = "System",
    user_role: str = "system",
    action: str = "ACTION",
    target_type: str = "DOCUMENT",
    target_id: str = "0",
    previous_value: str = None,
    new_value: str = None,
    ip_address: str = "127.0.0.1"
):
    log = AuditLog(
        user_id=user_id,
        username=username,
        user_role=user_role,
        action=action,
        target_type=target_type,
        target_id=str(target_id),
        previous_value=previous_value,
        new_value=new_value,
        ip_address=ip_address
    )
    db.add(log)
    db.commit()
    return log
