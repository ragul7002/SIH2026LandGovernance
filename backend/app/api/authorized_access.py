"""
FastAPI REST API Endpoints for Authorized Land & Property Access in TN-LGIP
"""

from fastapi import APIRouter, Query, HTTPException, Body
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field
from app.data.authorized_access_service import authorized_service

router = APIRouter(prefix="/authorized", tags=["Authorized Land & Property Access"])

class StampDutyRequest(BaseModel):
    guideline_value_inr: float = Field(..., description="Guideline value in INR")
    consideration_value_inr: Optional[float] = Field(None, description="Actual consideration or market value in INR")
    property_type: Optional[str] = Field("Agricultural", description="Property category")

class AuditLogRequest(BaseModel):
    user_role: str
    survey_no: str
    district: str
    taluk: str
    village: str
    access_type: str
    data_source: str
    status: str
    reason: str

@router.get("/status")
def get_authorization_status(
    role: str = Query("Public User", description="User role to verify clearance (e.g. Policymaker, Researcher, Government Analyst, Public User)")
) -> Dict[str, Any]:
    """
    Returns role-based authorization clearance and permitted scopes.
    """
    return authorized_service.check_authorization(role)

@router.get("/land-records")
def get_authorized_land_record(
    survey_no: str = Query(..., description="Survey Number (e.g. 42 or 42/1A)"),
    district: Optional[str] = Query(None, description="District name"),
    taluk: Optional[str] = Query(None, description="Taluk name"),
    village: Optional[str] = Query(None, description="Village name"),
    role: str = Query("Public User", description="User role for permission evaluation")
) -> Dict[str, Any]:
    """
    Returns comprehensive authorized land record details:
    Patta, Chitta, FMB boundaries, Guideline values, Stamp duty calculation, Land use zoning,
    Soil type, Aquifer zone, CRZ status, Proposed road widening, Encumbrance summary, and RERA info.
    """
    return authorized_service.get_authorized_land_record(
        survey_no=survey_no,
        district=district,
        taluk=taluk,
        village=village,
        user_role=role
    )

@router.post("/stamp-duty-calc")
def calculate_stamp_duty(request: StampDutyRequest) -> Dict[str, Any]:
    """
    Calculates statutory Stamp Duty (7%) and Registration Fee (4%) as per Tamil Nadu Registration schedule.
    """
    return authorized_service.calculate_stamp_duty(
        guideline_value_inr=request.guideline_value_inr,
        consideration_value_inr=request.consideration_value_inr,
        property_type=request.property_type or "Agricultural"
    )

@router.get("/audit-logs")
def get_audit_logs(
    limit: int = Query(50, description="Max number of audit log entries to return")
) -> Dict[str, Any]:
    """
    Returns live compliance audit logs of all authorized access queries.
    """
    logs = authorized_service.get_audit_logs(limit)
    return {
        "total_records": len(logs),
        "audit_logs": logs
    }

@router.post("/audit-log")
def record_audit_log(entry: AuditLogRequest) -> Dict[str, Any]:
    """
    Records an access event into the audit trail.
    """
    return authorized_service.log_access(
        user_role=entry.user_role,
        survey_no=entry.survey_no,
        district=entry.district,
        taluk=entry.taluk,
        village=entry.village,
        access_type=entry.access_type,
        data_source=entry.data_source,
        status=entry.status,
        reason=entry.reason
    )
