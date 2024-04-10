import { prisma } from "~/libs";

async function fetchDataFromApi(apiUrl) {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const apiData = await response.json();
    return apiData;
  } catch (error) {
    console.error(`Error fetching data from API: ${error.message}`);
    return null;
  }
}
function activixLeads(api) {
  // before going to prisma this revord needs a findance.id along with the warrnty along with saving the acticix leas
  const mappedData = {
    id: api.id,
    account_id: api.account_id,
    clientfileId: api.customer_id,
    source_id: api.source_id,
    provider_id: api.provider_id,
    appointment_date: api.appointment_date, // start
    phone_appointment_date: api.phone_appointment_date,
    available_date: api.available_date,
    be_back_date: api.be_back_date,
    birth_date: api.birth_date,
    call_date: api.call_date,
    created_at: api.created_at,
    csi_date: api.csi_date,
    delivered_date: api.deliveredDate,
    deliverable_date: api.deliverable_date,
    delivery_date: api.delivery_date, // pickUpDate
    home_presented_date: api.home_presented_date,
    paperwork_date: api.paperwork_date,
    presented_date: api.presented_date,
    promised_date: api.promised_date,
    refinanced_date: api.refinanced_date,
    road_test_date: api.road_test_date,
    home_road_test_date: api.home_road_test_date,
    sale_date: api.sale_date,
    take_over_date: api.take_over_date,
    unsubscribe_all_date: api.unsubscribe_all_date,
    unsubscribe_call_date: api.unsubscribe_call_date,
    unsubscribe_email_date: api.unsubscribe_email_date,
    unsubscribe_sms_date: api.unsubscribe_sms_date,
    updated_at: api.updated_at,
    address_line1: api.address_line1, // address
    address_line2: api.address_line2,
    business: api.business,
    business_name: api.business_name,
    campaign: api.campaign,
    city: api.city,
    civility: api.civility,
    country: api.country,
    created_method: api.created_method,
    credit_approved: api.approved,
    dealer_tour: api.dealer_tour,
    division: api.division,
    financial_institution: api.financial_institution,
    firstName: api.first_name,
    form: api.form,
    funded: api.funded,
    gender: api.gender,
    inspected: api.inspected,
    keyword: api.keyword,
    lastName: api.last_name,
    locale: api.locale,
    navigation_history: api.navigation_history,
    postal_code: api.postalCode,
    progress_state: api.progress_state,
    provider: api.provider,
    province: api.province,
    qualification: api.qualification,
    rating: api.rating,
    referrer: api.referrer,
    result: api.result,
    search_term: api.search_term,
    second_contact: api.second_contact,
    second_contact_civility: api.second_contact_civility,
    segment: api.segment,
    source: api.source,
    status: api.status,
    type: api.type,
    walk_around: api.walk_around,
    comment: api.comment,
  };
  return mappedData;
}
function activixCommunication(api) {
  const mappedData = {
    id: api.id,
    lead_id: api.lead_id,
    user_id: api.user_id,
    created_at: api.created_at,
    updated_at: api.updated_at,
    executed_at: api.executed_at,
    method: api.method,
    type: api.type,
    description: api.description,
    // Call attributes: api.    // Call attributes,
    call_duration: api.call_duration,
    call_phone: api.call_phone,
    call_status: api.call_status,
    // email: api.    // email,
    email_subject: api.email_subject,
    email_body: api.email_body,
    email_user: api.email_user,
    // video attributes: api.   // video attributes,
    url: api.url,
    answered: api.answered,
    attempted: api.attempted,
    error: api.error,
    interrupted: api.interrupted,
    pending: api.pending,
    unanswered: api.unanswered,
  };
  return mappedData;
}
function activixEmail(api) {
  const mappedData = {
    id: api.id,
    lead_id: api.lead_id,
    created_at: api.created_at,
    updated_at: api.updated_at,
    address: api.address,
    type: api.type,
    string: api.string,
    valid: api.valid,
  }
  return mappedData
}
function activixEvent(api) {
  const mappedData = {
    id: api.id,
    lead_id: api.lead_id,
    owner_id: api.owner_id,
    completed_at: api.completed_at,
    created_at: api.created_at,
    end_at: api.end_at,
    start_at: api.start_at,
    updated_at: api.updated_at,
    canceled: api.canceled,
    completed: api.completed,
    confirmed: api.confirmed,
    description: api.description,
    no_show: api.no_show,
    priority: api.priority,
    title: api.title,
    // Nested Objects: api.//,
    Attribute: api.Attribute,
    lead: api.lead,
    owner: api.owner,
  }
  return mappedData
}
function activixNotes(api) {
  const mappedData = {
    id: api.id,
    parent_id: api.parent_id,
    lead_id: api.lead_id,
    user_id: api.user_id,
    created_at: api.created_at,
    updated_at: api.updated_at,
    content: api.content,
    file_url: api.file_url,
  }
  return mappedData
}
function activixPhones(api) {
  const mappedData = {
    id: api.id,
    lead_id: api.lead_id,
    created_at: api.created_at,
    updated_at: api.updated_at,
    extension: api.extension,
    number: api.number,
    type: api.type,
    valid: api.valid,
  }
  return mappedData
}
function activixProducts(api) {
  const mappedData = {

    created_at: api.created_atL,
    updated_at: api.updated_atL,
    category: api.categoryL,
    minutes: api.minutesL,
    name: api.nameL,
    notes: api.notesL,
    premium: api.premiumL,
    price: api.priceL,
    sold: api.soldL,
    boolean: api.booleanL,
    type: api.typeL,
    ID: api.IDL,
    Name: api.NameL,
    Type: api.TypeL,
    Label: api.LabelL,
    ins_filling: api.ins_fillingL,
    ins_rental: api.ins_rentalL,
    ins_invalidity: api.ins_invalidityL,
    ins_health: api.ins_healthL,
    ins_life: api.ins_lifeL,
    extended_warranty: api.extended_warrantyL,
    rustproofing: api.rustproofingL,
    chiselling: api.chisellingL,
    anti_theft: api.anti_theftL,
    starter: api.starterL,
    window_tint: api.window_tintL,
    pre_paid_maintenance: api.pre_paid_maintenanceL,
    seat_protection: api.seat_protectionL,
    financing: api.financingL,
    pef: api.pefL,
    pep: api.pepL,
    other: api.otherL,
    pellicule: api.pelliculeL,
    windshield_treatment: api.windshield_treatmentL,
    paint_treatment: api.paint_treatmentL,
    roof_treatment: api.roof_treatmentL,
    leather_tissu_interior_treatment: api.leather_tissu_interior_treatmentL,
    maintenance_a: api.maintenance_aL,
    maintenance_b: api.maintenance_bL,
    maintenance_c: api.maintenance_cL,
    maintenance_d: api.maintenance_dL,
    maintenance_recommended: api.maintenance_recommendedL,
    diagnostic: api.diagnosticL,
    air_filter: api.air_filterL,
    pollen_filter: api.pollen_filterL,
    alignment: api.alignmentL,
    brakes: api.brakesL,
    injection: api.injectionL,
    transmission: api.transmissionL,
    wash: api.washL,
    tires: api.tiresL,
    parts: api.partsL,
    body: api.bodyL,
    oil_filter: api.oil_filterL,
    others: api.othersL,
    niotext: api.niotextL,
    walk_in: api.walk_inL,
    sale_table: api.sale_tableL,
    in_turn: api.in_turnL,
    renewal: api.renewalL,
    event: api.eventL,
    service: api.serviceL,

  }
  return mappedData
}
function activixUser(api) {
  const mappedData = {
    id: api.id,
    created_at: api.created_at,
    updated_at: api.updated_at,
    email: api.email,
    first_name: api.first_name,
    last_name: api.last_name,
  }
  return mappedData
}
function activixVehicle(api) {
  const mappedData = {
    id: api.id,
    lead_id: api.lead_id,
    created_at: api.created_at,
    end_contract_date: api.end_contract_date,
    end_warranty_date: api.end_warranty_date,
    purchase_date: api.purchase_date,
    recorded_date: api.recorded_date,
    sold_date: api.sold_date,
    updated_at: api.updated_at,
    accessories: api.accessories,
    actual_value: api.actual_value,
    allowed_odometer: api.allowed_odometer,
    balance: api.balance,
    cash_down: api.cash_down,
    category: api.category,
    category_rv: api.category_rv,
    certified: api.certified,
    client_number: api.client_number,
    color_exterior: api.color_exterior,
    color_interior: api.color_interior,
    comment: api.comment,
    condition: api.condition,
    driving_wheels: api.driving_wheels,
    engine: api.engine,
    extended_warranty: api.extended_warranty,
    fuel: api.fuel,
    license_plate: api.license_plate,
    make: api.make,
    modality: api.modality,
    model: api.model,
    odometer: api.odometer,
    offer_number: api.offer_number,
    option: api.option,
    order_number: api.order_number,
    payment: api.payment,
    payment_frequency: api.payment_frequency,
    preparation: api.preparation,
    price: api.price,
    profit: api.profit,
    rate: api.rate,
    recall: api.recall,
    residual: api.residual,
    security_deposit: api.security_deposit,
    sleeping: api.sleeping,
    sold: api.sold,
    sold_by: api.sold_by,
    stock: api.stock,
    stock_state: api.stock_state,
    term: api.term,
    tire: api.tire,
    transmission: api.transmission,
    string: api.string,
    trim: api.trim,
    type: api.type,
    value: api.value,
    vin: api.vin,
    warranty: api.warranty,
    weight: api.weight,
    year: api.year,
    // wanted vehicle: api.// wanted vehicle,
    budget_max: api.budget_max,
    budget_min: api.budget_min,
    length_max: api.length_max,
    length_min: api.length_min,
    year_max: api.year_max,
    year_min: api.year_min,
    Attribute: api.Attribute,
    verified_by: api.verified_by,


  }
  return mappedData
}
function activixTask(api) {
  const mappedData = {
    id: api.id, // integer Unique identifier for the task.
    lead_id: api.lead_id, // integer ID of the lead associated with the task.
    owner_id: api.owner_id, // integer ID of the owner associated with the task.
    completed_at: api.completed_at, //string ​ISO datetime representing when the task was completed.
    created_at: api.created_at, // string ​ISO datetime representing when the task was created.
    date: api.date, // string // ​ISO dateti e representing the date of the task.
    updated_at: api.updated_at, //  string ​ISO datetime representing when the task was last updated.
    completed: api.completed, //  boolean Determine if the task is completed.
    description: api.description, //  string The description of the task.
    priority: api.priority, //  string The priority of the task. Possible values are normal or high. New values might be added in the future.
    title: api.title, //  string The title of the event.
    type: api.type, // string The type of the event. Possible values are call, email, sms or csi. New values might be added in the future.
  }
  return mappedData
}
// Assuming this function is part of a route handler or a controller in a Remix-Run app
async function yourRouteHandler(req, res) {
  // const apiUrl = "https://docs.crm.activix.ca/api/objects/lead";

  // Fetch data from the API
  const apiData = await fetchDataFromApi(apiUrl);

  if (apiData) {
    // Map API data to your system's data structure
    const mappedSystemData = activixLeads(apiData);

    // Now you have the mapped data in mappedSystemData
    // You can use it as needed in your Remix-Run route logic
    res.json({ data: mappedSystemData });
  } else {
    // Handle the case where fetching data from the API failed
    res.json({ error: "Failed to fetch data from API" });
  }
}


