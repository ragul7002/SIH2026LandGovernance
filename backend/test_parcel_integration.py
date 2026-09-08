"""
Automated Validation Suite for TNGIS Land Parcel Intelligence & Village Hierarchy Integration
"""

import sys
import os

# Set UTF-8 for console output on Windows
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.data.parcel_data_service import parcel_service

print("=== STARTING TNGIS LAND PARCEL & VILLAGE INTEGRATION TESTS ===")

# 1. Test Village Directory Loading & Search
print("1. Testing Village Directory...")
print(f"   Total Villages Loaded: {len(parcel_service.villages)}")
assert len(parcel_service.villages) > 10000, f"Expected >10,000 villages, got {len(parcel_service.villages)}"

tiruppur_villages = parcel_service.get_villages(district="Namakkal", taluk="Rasipuram", limit=10)
print(f"   Namakkal -> Rasipuram Villages found: {tiruppur_villages['total_matches']}")
assert tiruppur_villages['total_matches'] > 0, "Expected at least 1 village in Rasipuram"
sample_v = tiruppur_villages['villages'][0]
print(f"   Sample Village: {sample_v['village_name']} ({sample_v['village_native']}) - Code: {sample_v['village_code']}, Pincode: {sample_v['pincode']}")

# 2. Test Cadastral Land Parcels Loading & Filtering
print("\n2. Testing Cadastral Parcels...")
print(f"   Total Cadastral Features: {len(parcel_service.cadastral_features)}")
assert len(parcel_service.cadastral_features) > 1000, f"Expected >1000 parcels, got {len(parcel_service.cadastral_features)}"

thi_parcels = parcel_service.get_parcels_geojson(district="Thiruvallur", taluk="Gummidipoondi", limit=50)
print(f"   Thiruvallur -> Gummidipoondi Parcels returned: {thi_parcels['total_parcels']}")
assert thi_parcels['total_parcels'] > 0, "Expected parcels in Gummidipoondi"
sample_p = thi_parcels['features'][0]['properties']
print(f"   Sample Parcel Survey No: {sample_p['survey_no']}, Land Use: {sample_p['land_use']}, Area: {sample_p['area_sqm']} m² ({sample_p['area_acres']} acres)")

# 3. Test Full 9-Section Structured Parcel Intelligence
print("\n3. Testing 9-Section Parcel Intelligence Generation...")
intel = parcel_service.get_parcel_intelligence(survey_no="TN-THI-000001", district="Thiruvallur", taluk="Gummidipoondi")

assert "land_identification" in intel, "Missing land_identification"
assert "land_information" in intel, "Missing land_information"
assert "environment" in intel, "Missing environment"
assert "infrastructure" in intel, "Missing infrastructure"
assert "historical_intelligence" in intel, "Missing historical_intelligence"
assert "policy_research" in intel, "Missing policy_research"
assert "patta_ownership" in intel, "Missing patta_ownership"
assert "provenance" in intel, "Missing provenance"

print("   Land ID:", intel["land_identification"])
print("   Land Info:", intel["land_information"])
print("   Environment:", intel["environment"])
print("   Infrastructure:", intel["infrastructure"])
print("   Historical Intel:", intel["historical_intelligence"])
print("   Policy Research:", intel["policy_research"]["applicable_building_rules"])
print("   Ownership Notice:", intel["patta_ownership"]["access_notice"])
print(f"   Provenance items count: {len(intel['provenance'])}")

# 4. Test Survey Number Search
print("\n4. Testing Survey Search...")
search_res = parcel_service.search_parcels(query="000001")
print(f"   Search '000001' Matches: {search_res['total_matches']}")
assert search_res['total_matches'] > 0, "Expected search matches for 000001"
print(f"   Top Match: {search_res['results'][0]['survey_no']} in {search_res['results'][0]['taluk']}, {search_res['results'][0]['district']}")

print("\n=== ALL TNGIS PARCEL INTEGRATION TESTS PASSED SUCCESSFULLY! ===")
