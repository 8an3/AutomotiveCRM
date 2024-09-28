import React, { useContext, useEffect, useRef, useState } from 'react';
import type { SidebarProps } from '../../../../types';
import { RIGHT_SIDEBAR_WIDTH } from '../../../../constants';
import { I18nContext } from '../../../../contexts';
import { getSidebarContentHeight } from '../../../../helper';
import { theme, Input, Typography, Divider, Button, Select } from 'antd';
import SelectableSortableContainer from './SelectableSortableContainer';
import { FaCheck } from "react-icons/fa";

const { Text } = Typography;
const { TextArea } = Input;

const headHeight = 40;

const ListView = (

  props: Pick<
    SidebarProps,
    | 'schemas'
    | 'onSortEnd'
    | 'onEdit'
    | 'size'
    | 'hoveringSchemaId'
    | 'onChangeHoveringSchemaId'
    | 'changeSchemas'
  >
) => {
  const {
    schemas,
    onSortEnd,
    onEdit,
    size,
    hoveringSchemaId,
    onChangeHoveringSchemaId,
    changeSchemas,
  } = props;
  const { token } = theme.useToken();
  const i18n = useContext(I18nContext);
  const [isBulkUpdateFieldNamesMode, setIsBulkUpdateFieldNamesMode] = useState(false);
  const [fieldNamesValue, setFieldNamesValue] = useState('');
  const height = getSidebarContentHeight(size.height);

  const commitBulk = () => {
    const names = fieldNamesValue.split('\n');
    if (names.length !== schemas.length) {
      alert(i18n('errorBulkUpdateFieldName'));
    } else {
      changeSchemas(
        names.map((value, index) => ({
          key: 'name',
          value,
          schemaId: schemas[index].id,
        }))
      );
      setIsBulkUpdateFieldNamesMode(false);
    }
  };

  const startBulk = () => {
    setFieldNamesValue(schemas.map((s) => s.name).join('\n'));
    setIsBulkUpdateFieldNamesMode(true);
  };


  const clientAtr = [
    { name: "First Name", attribute: "firstName" },
    { name: "Last Name", attribute: "lastName" },
    { name: "Full Name", attribute: "name" },
    { name: "Phone", attribute: "phone" },
    { name: "Email", attribute: "email" },
    { name: "Address", attribute: "address" },
    { name: "City", attribute: "city" },
    { name: "Province", attribute: "province" },
    { name: "Postal Code", attribute: "postal" },
    { name: "Drivers License", attribute: "dl" },
    { name: "Date of Birth", attribute: "dob" },
    { name: "Type Of Contact", attribute: "typeOfContact", },
    { name: "Time To Contact", attribute: "timeToContact", },
  ];
  const unitInfo = [
    { name: "Year", attribute: "year" },
    { name: "Brand", attribute: "brand" },
    { name: "Model", attribute: "model" },
    { name: "Trim", attribute: "trim" },
    { name: "Stock Number", attribute: "stockNumber" },
    { name: "VIN", attribute: "vin" },
    { name: "Color", attribute: "color" },
    { name: "Balance", attribute: "balance" },
    { name: "Package Number", attribute: "packageNumber" },
    { name: "Package Price", attribute: "packagePrice" },
    { name: "Stock Number", attribute: "stockNumber" },
    { name: "Type", attribute: "type" },
    { name: "Class", attribute: "class" },
    { name: "Year", attribute: "year" },
    { name: "Make", attribute: "make" },
    { name: "Model", attribute: "model" },
    { name: "Model Name", attribute: "modelName" },
    { name: "Sub Model", attribute: "submodel" },
    { name: "Sub Sub Model", attribute: "subSubmodel" },
    { name: "Price", attribute: "price" },
    { name: "Exterior Color", attribute: "exteriorColor" },
    { name: "Mileage", attribute: "mileage" },
    { name: "Consignment", attribute: "consignment" },
    { name: "On Order", attribute: "onOrder" },
    { name: "Expected On", attribute: "expectedOn" },
    { name: "Status", attribute: "status" },
    { name: "Order Status", attribute: "orderStatus" },
    { name: "hdcFO Number", attribute: "hdcFONumber" },
    { name: "hdmcFO Number", attribute: "hdmcFONumber" },
    { name: "VIN", attribute: "vin" },
    { name: "Age", attribute: "age" },
    { name: "Floor Plan Due Date", attribute: "floorPlanDueDate" },
    { name: "Location", attribute: "location" },
    { name: "Stocked", attribute: "stocked" },
    { name: "Stocked Date", attribute: "stockedDate" },
    { name: "Is New", attribute: "isNew" },
    { name: "Actual Cost", attribute: "actualCost" },
    { name: "mfg Serial Number", attribute: "mfgSerialNumber" },
    { name: "Engine Number", attribute: "engineNumber" },
    { name: "Plates", attribute: "plates" },
    { name: "Key Number", attribute: "keyNumber" },
    { name: "Length", attribute: "length" },
    { name: "Width", attribute: "width" },
    { name: "Engine", attribute: "engine" },
    { name: "Fuel Type", attribute: "fuelType" },
    { name: "Power", attribute: "power" },
    { name: "Chassis Number", attribute: "chassisNumber" },
    { name: "Chassis Year", attribute: "chassisYear" },
    { name: "Chassis Make", attribute: "chassisMake" },
    { name: "Chassis Model", attribute: "chassisModel" },
    { name: "Chassis Type", attribute: "chassisType" },
    { name: "Registration State", attribute: "registrationState" },
    { name: "Registration Expiry", attribute: "registrationExpiry" },
    { name: "Gross Weight", attribute: "grossWeight" },
    { name: "Net Weight", attribute: "netWeight" },
    { name: "Insurance Company", attribute: "insuranceCompany" },
    { name: "Policy Number", attribute: "policyNumber" },
    { name: "Insurance Agent", attribute: "insuranceAgent" },
    { name: "Insurance Start Date", attribute: "insuranceStartDate" },
    { name: "Insurance End Date", attribute: "insuranceEndDate" },
    { name: "Sold", attribute: "sold" },
  ];
  const salesPersonAttr = [
    { name: "First Name", attribute: "userFname" },
    { name: "Full Name", attribute: "userFullName" },
    { name: "Phone or EXT", attribute: "userPhone" },
    { name: "Email", attribute: "userEmail" },
    { name: "Cell #", attribute: "userCell" },
  ];
  const FandIAttr = [
    { name: "Finance Manager Email", attribute: "financeManager", },

  ];
  const dealerCharges = [
    { name: "Freight", attribute: "freight", },
    { name: "Admin", attribute: "admin", },
    { name: "Commodity", attribute: "commodity", },
    { name: "PDI", attribute: "pdi", },
    { name: "Discount %", attribute: "discountPer", },
    { name: "Loan Prot", attribute: "userLoanProt", },
    { name: "Tire and Rim", attribute: "userTireandRim", },
    { name: "Gap", attribute: "userGap", },
    { name: "Ext Warr", attribute: "userExtWarr", },
    { name: "Services pkg", attribute: "userServicespkg", },
    { name: "deliveryCharge", attribute: "deliveryCharge", },
    { name: "VIN Etching", attribute: "vinE", },
    { name: "Life and Disability", attribute: "lifeDisability", },
    { name: "Rust Proofing", attribute: "rustProofing", },
    { name: "Other", attribute: "userOther", },
  ];
  const wantedVehAttr = [
    { name: "Paint Prem", attribute: "paintPrem", },
    { name: "Stock Num", attribute: "stockNum", },
    { name: "Year", attribute: "year", },
    { name: "Brand", attribute: "brand", },
    { name: "Mileage", attribute: "mileage", },
    { name: "Model", attribute: "model", },
    { name: "Model Name 2", attribute: "model1", },
    { name: "Color", attribute: "color", },
    { name: "Model Code", attribute: "modelCode", },
    { name: "MSRP", attribute: "msrp", },
    { name: "Trim", attribute: "trim", },
    { name: "VIN", attribute: "vin", },
  ];
  const tradeInfo = [
    { name: "Trade Value", attribute: "tradeValue", },
    { name: "Trade Desc", attribute: "tradeDesc", },
    { name: "Trade Color", attribute: "tradeColor", },
    { name: "Trade Year", attribute: "tradeYear", },
    { name: "Trade Make", attribute: "tradeMake", },
    { name: "Trade Vin", attribute: "tradeVin", },
    { name: "Trade Trim", attribute: "tradeTrim", },
    { name: "Trade Mileage", attribute: "tradeMileage", },
  ];
  const dealerInfo = [
    { name: "Dealer Name", attribute: "dealerName" },
    { name: "Dealer Address", attribute: "dealerAddress" },
    { name: "Dealer City", attribute: "dealerCity" },
    { name: "Dealer Prov", attribute: "dealerProv" },
    { name: "Dealer Postal", attribute: "dealerPostal" },
    { name: "Dealer Phone", attribute: "dealerPhone" },
    { name: "Loan Prot", attribute: "userLoanProt" },
    { name: "Tire and Rim", attribute: "userTireandRim" },
    { name: "Gap", attribute: "userGap" },
    { name: "Ext Warr", attribute: "userExtWarr" },
    { name: "Services Pkg", attribute: "userServicespkg" },
    { name: "VinE", attribute: "vinE" },
    { name: "Life Disability", attribute: "lifeDisability" },
    { name: "Rust Proofing", attribute: "rustProofing" },
    { name: "Licensing", attribute: "userLicensing" },
    { name: "Finance", attribute: "userFinance" },
    { name: "Demo", attribute: "userDemo" },
    { name: "Gas On Del", attribute: "userGasOnDel" },
    { name: "OMVIC", attribute: "userOMVIC" },
    { name: "Other", attribute: "userOther" },
    { name: "Tax", attribute: "userTax" },
    { name: "Air Tax", attribute: "userAirTax" },
    { name: "Tire Tax", attribute: "userTireTax" },
    { name: "Govern", attribute: "userGovern" },
    { name: "PDI", attribute: "userPDI" },
    { name: "Labour", attribute: "userLabour" },
    { name: "Market Adj", attribute: "userMarketAdj" },
    { name: "Commodity", attribute: "userCommodity" },
    { name: "Destination Charge", attribute: "destinationCharge" },
    { name: "Freight", attribute: "userFreight" },
    { name: "Admin", attribute: "userAdmin" },
  ];
  const financeInfo = [
    { name: "Int. Rate", attribute: "iRate", },
    { name: "Months", attribute: "months", },
    { name: "Discount", attribute: "discount", },
    { name: "Total", attribute: "total", },
    { name: "With Tax", attribute: "onTax", },
    { name: "on60", attribute: "on60", },
    { name: "Bi-weekly", attribute: "biweekly", },
    { name: "Weekly", attribute: "weekly", },
    { name: "Weekly Oth", attribute: "weeklyOth", },
    { name: "Bi-weekOth", attribute: "biweekOth", },
    { name: "oth60", attribute: "oth60", },
    { name: "Weeklyqc", attribute: "weeklyqc", },
    { name: "Bi-weeklyqc", attribute: "biweeklyqc", },
    { name: "qc60", attribute: "qc60", },
    { name: "Deposit", attribute: "deposit", },
    { name: "biweeklNatWOptions", attribute: "biweeklNatWOptions", },
    { name: "weeklylNatWOptions", attribute: "weeklylNatWOptions", },
    { name: "nat60WOptions", attribute: "nat60WOptions", },
    { name: "weeklyOthWOptions", attribute: "weeklyOthWOptions", },
    { name: "biweekOthWOptions", attribute: "biweekOthWOptions", },
    { name: "oth60WOptions", attribute: "oth60WOptions", },
    { name: "biweeklNat", attribute: "biweeklNat", },
    { name: "weeklylNat", attribute: "weeklylNat", },
    { name: "nat60", attribute: "nat60", },
    { name: "qcTax", attribute: "qcTax", },
    { name: "otherTax", attribute: "otherTax", },
    { name: "totalWithOptions", attribute: "totalWithOptions", },
    { name: "otherTaxWithOptions", attribute: "otherTaxWithOptions", },
    { name: "Desired Payments", attribute: "desiredPayments", },
    { name: "Licensing", attribute: "licensing", },
    { name: "Options", attribute: "options", },
    { name: "Accessories", attribute: "accessories", },
    { name: "Labour", attribute: "labour", },

    { name: "Sales Person Email", attribute: "userEmail", },
    { name: "Sales Person Name", attribute: "userName", },
    { name: "Finance Manager Email", attribute: "financeManager", },

    { name: "Lead Note", attribute: "leadNote", },
    { name: "Lien", attribute: "lien", },
  ];

  const [theList, setTheList] = useState(financeInfo)
  const [name, setName] = useState('')
  const [open, setOpen] = useState(false)

  const copyText = (text: any) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedText(text);
        setTimeout(() => setCopiedText(""), 3000); // Reset after 3 seconds
      })
      .catch((error) => {
        console.error("Failed to copy text: ", error);
      });
  };
  const [copiedText, setCopiedText] = useState("");
  const timerRef = useRef(0);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);


  function SidebarNav({ items }: SidebarNavProps) {
    return (
      <div

        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '0.5rem',
          maxWidth: '95%',
          marginTop: '1rem',
          justifyContent: 'center',
        }}
      >
        {items.map((item: any) => (
          <>
            <Button
              onClick={() => copyText(item.attribute)}
              key={item.name}
              style={{
                backgroundColor: name === item.name ? '#232324' : 'transparent',
                color: name === item.name ? 'inherit' : '#a1a1aa',
                width: '90%',
                margin: '0 auto',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'flex-start',
                transition: 'background-color 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = name === item.name ? '#232324' : 'transparent';
              }}
            >{item.name}</Button>
            {copiedText === item.name && (
              <FaCheck strokeWidth={1.5} className="ml-2 text-lg hover:text-primary" />
            )}
          </>
        ))
        }
      </div >
    )
  }

  useEffect(() => {
    if (name === 'clientAtr') {
      setTheList(clientAtr)
    } else if (name === 'unitInfo') {
      setTheList(unitInfo)
    } else if (name === 'salesPersonAttr') {
      setTheList(salesPersonAttr)
    } else if (name === 'FandIAttr') {
      setTheList(FandIAttr)
    } else if (name === 'dealerCharges') {
      setTheList(dealerCharges)
    } else if (name === 'wantedVehAttr') {
      setTheList(wantedVehAttr)
    } else if (name === 'tradeInfo') {
      setTheList(tradeInfo)
    } else if (name === 'dealerInfo') {
      setTheList(dealerInfo)
    } else if (name === 'financeInfo') {
      setTheList(financeInfo)
    }

  }, [name]);


  return (
    <div>
      <div style={{ height: headHeight, display: 'flex', alignItems: 'center' }}>
        <Text strong style={{ textAlign: 'center', width: '100%' }}>
          {open ?
            <>
              <Button
                style={{
                  top: !open ? '1rem' : undefined,
                  right: !open ? '5rem' : undefined,
                  zIndex: 100,
                  margin: open ? '0 auto' : undefined,
                }}
                onClick={() => setOpen(!open)}
              >
                Glossary
              </Button></> :
            <>
              {i18n('fieldsList')}   <Button
                style={{
                  position: 'absolute',
                  display: 'flex',
                  top: '1rem',
                  right: '5rem',
                  zIndex: 100,
                }}
                onClick={() => setOpen(!open)}
              >
                Glossary
              </Button>
            </>}
        </Text>
      </div>
      <Divider style={{ marginTop: token.marginXS, marginBottom: token.marginXS }} />
      <div style={{ height: height - headHeight }}>
        {open ? (<>
          <Select
            defaultValue='Sales Deal'
            style={{
              width: 250,
              margin: '0 auto',
              display: 'block',
            }}
            onChange={(value: any) => setName(value)}
            options={[
              { value: 'Documentation', label: 'Documentation' },
              { value: 'clientAtr', label: 'Client' },
              { value: 'wantedVehAttr', label: 'Vehicle Info' },
              { value: 'tradeInfo', label: 'Trade Info' },
              { value: 'unitInfo', label: 'Unit Info from Inventory' },
              { value: 'salesPersonAttr', label: 'Sales Person', disabled: true },
              { value: 'FandIAttr', label: 'Finance Manager', disabled: true },
              { value: 'dealerCharges', label: 'Dealer Charges' },
              { value: 'dealerInfo', label: 'Dealer Info' },
              { value: 'financeInfo', label: 'Sales Deal' },
            ]}
          />
          {name !== 'Documentation' ? (
            <SidebarNav items={theList} />
          ) : (<>
            <div

              style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '0.5rem',
                maxWidth: '95%',
                marginTop: '1rem',
                justifyContent: 'center',
              }}
            >
              <Text>In order for the system to know where to put the correct data where you want it to be,</Text>
              <Text>We need to map the data, so if your looking for the client's first name. </Text>
              <Text>1. Click glossary to enter the menu.</Text>
              <Text>2. Click on first name, this copies the value so that you can paste it, later.</Text>
              <Text>No matter which client you print documents for, it pulls that information out of the database correctly every time.</Text>
              <Text>3. Select what type of component from the left hand bar.</Text>
              <Text>4. Drag it to where you would like it on the template.</Text>
              <Text>5. Under name of the component (in the right sidebar), paste what you have in your clipboard with ctrl + v.</Text>
              <Text>6. Customize text styling if needed.</Text>


            </div>

          </>
          )}
        </>) : <>
          {isBulkUpdateFieldNamesMode ? (
            <TextArea
              wrap="off"
              value={fieldNamesValue}
              onChange={(e) => setFieldNamesValue(e.target.value)}
              style={{
                paddingLeft: 30,
                height: height - headHeight,
                width: RIGHT_SIDEBAR_WIDTH - 35,
                lineHeight: '2.75rem',
              }}
            />
          ) : (
            <SelectableSortableContainer
              schemas={schemas}
              hoveringSchemaId={hoveringSchemaId}
              onChangeHoveringSchemaId={onChangeHoveringSchemaId}
              onSortEnd={onSortEnd}
              onEdit={onEdit}
            />
          )}
          <div style={{ paddingTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            {isBulkUpdateFieldNamesMode ? (
              <>
                <Button size="small" type="text" onClick={commitBulk}>
                  <u> {i18n('commitBulkUpdateFieldName')}</u>
                </Button>
                <span style={{ margin: '0 1rem' }}>/</span>
                <Button size="small" type="text" onClick={() => setIsBulkUpdateFieldNamesMode(false)}>
                  <u> {i18n('cancel')}</u>
                </Button>
              </>
            ) : (
              <Button size="small" type="text" onClick={startBulk}>
                <u> {i18n('bulkUpdateFieldName')}</u>
              </Button>
            )}
          </div>
        </>}

      </div>
    </div>
  );
};

export default ListView;
//


type SidebarNavProps = {
  items: any;
};

