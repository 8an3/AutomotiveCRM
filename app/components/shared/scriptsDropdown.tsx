// i want to create a dropdown that will allow me to select a catergory of scripts
// and then display the scripts in that catergory
// i want to be able to select a script and have it display in the editor
// i dont want to be able to add a script
// i dont want to be able to delete, add, or edit a catergory or script just view them
// i want to be able to search for a script in the dropdown
// i want to be able to sort the scripts by name or date
// i want to be able to filter the scripts by catergory
// i want a dynamic drop down to choose say for example closes and then the next drop down will say direct close, question close, assumptive close, alternative close, problem solving close, emotional close, felt close, summary close, trial close, and then when i select one of those it will display the scripts in that catergory
/* these are the categories     closes,
    scripts,
    overcomes,
    followups,
    qualifying,
    stories,
    testDrives,
    upsell,
*/

import { json, type DataFunctionArgs } from "@remix-run/node";
import { useEffect, useState } from "react";
//import { authenticator } from "~/services";
import { model } from '~/models'
import { directClose, getCloses, assumptiveClose, alternativeClose, problemSolvingClose, emotionalClose, getOvercomes, feltClose, getFollowUp, getQualifying, getTexting, getStories, testDriveClose, upSellClose, questionClose, summaryClose, trialClose, getScriptsListItems, getLatestScripts, createSalesScript } from '~/utils/scripts.server'

export async function loader({ request }: DataFunctionArgs) {
  const userSession = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const user = await model.user.query.getForSession({ id: userSession.id });

  const scripts = await getScriptsListItems();
  return json({
    ok: true,
    user,
    scripts,

  })
}


export default function ScriptsDropdown() {
  const [scripts, setScripts] = useState([]);
  const [user, setUser] = useState({});
  const [search, setSearch] = useState("");
  const [filteredScripts, setFilteredScripts] = useState([]);
  const [selectedScript, setSelectedScript] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([
    "closes",
    "scripts",
    "overcomes",
    "followups",
    "qualifying",
    "stories",
    "testDrives",
    "upsell",
  ]);

  useEffect(() => {
    const getScripts = async () => {
      const scriptsFromServer = await fetchScripts();
      setScripts(scriptsFromServer);
    };
    getScripts();
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const userFromServer = await fetchUser();
      setUser(userFromServer);
    };
    getUser();
  }, []);

  useEffect(() => {
    setFilteredScripts(
      scripts.filter((script) =>
        script.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, scripts]);

  const fetchScripts = async () => {
    const res = await fetch("/api/scripts");
    const data = await res.json();
    return data;
  };

  const fetchUser = async () => {
    const res = await fetch("/api/user");
    const data = await res.json();
    return data;
  };

  const getScriptsListItems = async () => {
    const res = await fetch("/api/scripts");
    const data = await res.json();
    return data;
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleScriptClick = (e) => {
    setSelectedScript(e.target.value);
  };

  const handleCategoryClick = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSortByName = () => {
    const sortedScripts = [...scripts].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    setScripts(sortedScripts);
  };

  const handleSortByDate = () => {
    const sortedScripts = [...scripts].sort((a, b) =>
      a.date.localeCompare(b.date)
    );
    setScripts(sortedScripts);
  };

  const handleFilterByCategory = () => {
    const filteredScripts = [...scripts].filter(
      (script) => script.category === selectedCategory
    );
    setScripts(filteredScripts);
  }


  // i want a dynamic drop down to choose say for example closes and then the next drop down will say direct close, question close, assumptive close, alternative close, problem solving close, emotional close, felt close, summary close, trial close, and then wit will show that whole catergory of scripts
  // these are the categories     closes,
  //  overcomes,
  // followups,
  // qualifying,
  // stories,
  // testDrives,
  // upsell,
  //  texting,
  // the scripts are loaded from the loader function
  // this is an example of how there are store
  // {
  // email: "",
  //  name: "",
  //  content: "Summarize the key benefits of the product and ask for the sale.",
  //  category: "closes",
  //  subCat: 'summary',
  //},
  // {
  //  email: "",
  //  name: "",
  //  content: "Ask for the sale.",
  //  category: "closes",
  //  subCat: 'direct',
  //},
  // can we make a second drop down work?



  return (
    <div className="scripts-dropdown">
      <div className="scripts-dropdown__header">
        <div className="scripts-dropdown__header__search">
          <input
            type="text"
            placeholder="Search Scripts"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <div className="scripts-dropdown__header__sort">
          <button onClick={handleSortByName}>Sort By Name</button>
          <button onClick={handleSortByDate}>Sort By Date</button>
        </div>
        <div className="scripts-dropdown__header__filter">
          <select
            name="category"
            id="category"
            value={selectedCategory}
            onChange={handleCategoryClick}
          >
            <option value="closes">Closes</option>
            <option value="overcomes">Overcomes</option>
            <option value="followups">Follow Ups</option>
            <option value="qualifying">Qualifying</option>
            <option value="stories">Stories</option>
            <option value="testDrives">Test Drives</option>
            <option value="upsell">Upsell</option>
            <option value="texting">Texting</option>
          </select>




          <button onClick={handleFilterByCategory}>Filter</button>
        </div>
      </div>
      <div className="scripts-dropdown__body">



      </div>
    </div>
  );

}
