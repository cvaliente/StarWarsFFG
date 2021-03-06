/**
 * A specialized form used to pop out the editor.
 * @extends {FormApplication}
 */
export default class PopoutEditor extends FormApplication {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "popout-editor",
      classes: ["starwarsffg", "sheet"],
      title: "Pop-out Editor",
      template: "systems/starwarsffg/templates/popout-editor.html",
      width: 320,
      height: 320,
    });
  }

  /**
   * Return a reference to the target attribute
   * @type {String}
   */
  get attribute() {
    return this.options.name;
  }

  /** @override */
  getData() {
    // Get current value
    let attr = getProperty(this.object.data, this.attribute);

    // Return data
    return {
      value: attr,
      cssClass: "editable popout-editor-window",
    };
  }

  /* -------------------------------------------- */

  /** @override */
  _updateObject(event, formData) {
    const updateData = {};
    updateData[`${this.attribute}`] = formData.value;

    // Update the object
    this.object.update(updateData);

    this.close();
  }

  /**
   * Renders the dice symbols based on strings
   * @param  {String} string
   */
  static renderDiceImages(str) {
    let html = str || "";

    const replaceValues = [
      {
        type: "ability",
        character: "d",
        pattern: /\[(AB)[a-zA-Z]*\]/gim,
      },
      {
        type: "advantage",
        character: "a",
        pattern: /\[(AD)[a-zA-Z]*\]/gim,
      },
      {
        type: "boost",
        character: "b",
        pattern: /\[(BO)[a-zA-Z]*\]/gim,
      },
      {
        type: "challenge",
        character: "c",
        pattern: /\[(CH)[a-zA-Z]*\]/gim,
      },
      {
        type: "dark",
        character: "z",
        pattern: /\[(DA)[a-zA-Z]*\]/gim,
      },
      {
        type: "despair",
        character: "y",
        pattern: /\[(DE)[a-zA-Z]*\]/gim,
      },
      {
        type: "difficulty",
        character: "d",
        pattern: /\[(DI)[a-zA-Z]*\]/gim,
      },
      {
        type: "forcepoint",
        character: "Y",
        pattern: /\[(FP[a-zA-Z]*|FORCEPOINT)\]/gim,
      },
      {
        type: "failure",
        character: "f",
        pattern: /\[(FA)[a-zA-Z]*\]/gim,
      },
      {
        type: "force",
        character: "C",
        pattern: /\[(FO)[a-zA-Z]*\]/gim,
      },
      {
        type: "light",
        character: "Z",
        pattern: /\[(LI)[a-zA-Z]*\]/gim,
      },
      {
        type: "proficiency",
        character: "c",
        pattern: /\[(PR)[a-zA-Z]*\]/gim,
      },
      {
        type: "remsetback",
        character: "b",
        pattern: /\[(RS[a-zA-Z]*|REMSETBACK)\]/gim,
      },
      {
        type: "restricted",
        character: "z",
        pattern: /\[(RE)[a-zA-Z]*\]/gim,
      },
      {
        type: "setback",
        character: "b",
        pattern: /\[(SE)[a-zA-Z]*\]/gim,
      },
      {
        type: "success",
        character: "s",
        pattern: /\[(SU)[a-zA-Z]*\]/gim,
      },
      {
        type: "threat",
        character: "t",
        pattern: /\[(TH)[a-zA-Z]*\]/gim,
      },
      {
        type: "triumph",
        character: "x",
        pattern: /\[(TR)[a-zA-Z]*\]/gim,
      },
      {
        type: "adddifficulty",
        character: "d",
        pattern: /\[(DD[a-zA-Z]*|ADDDIFFICULTY)\]/gim,
      },
      {
        type: "updifficulty",
        character: "d",
        pattern: /\[(UD[a-zA-Z]*|UPDIFFICULTY)\]/gim,
      },
      {
        type: "cancelthreat",
        character: "t",
        pattern: /\[(CT[a-zA-Z]*|CANCELTHREAT)\]/gim,
      },
    ];

    replaceValues.forEach((item) => {
      html = html.replace(item.pattern, `<span class='dietype ${item.type}'>${item.character}</span>`);
    });

    const oggdudeTags = [
      {
        startTag: "<span class='bold'>",
        endTag: "</span>",
        pattern: /(\[B\])(.[^\[]*)\[b\]/gm,
      },
      {
        startTag: "<p>",
        endTag: "</p>",
        pattern: /(\[P\])(.[^\[]*)/gm,
      },
      {
        startTag: "<br />",
        endTag: "",
        pattern: /(\[BR\])(.[^\[]*)/gm,
      },
      {
        startTag: "<span class='italic'>",
        endTag: "</span>",
        pattern: /(\[I\])(.[^\[]*)\[i\]/gm,
      },
      {
        startTag: "<h1>",
        endTag: "</h1>",
        pattern: /(\[H1\])(.[^\[]*)\[h1\]/gm,
      },
      {
        startTag: "<h2>",
        endTag: "</h2>",
        pattern: /(\[H2\])(.[^\[]*)\[h2\]/gm,
      },
      {
        startTag: "<h3>",
        endTag: "</h3>",
        pattern: /(\[H3\])(.[^\[]*)\[h3\]/gm,
      },
      {
        startTag: "<h4>",
        endTag: "</h4>",
        pattern: /(\[H4\])(.[^\[]*)\[h4\]/gm,
      },
    ];

    oggdudeTags.forEach((item) => {
      html = html.replace(item.pattern, `${item.startTag}$2${item.endTag}`);
    });

    return html;
  }

  static replaceRollTags(html, actorData) {
    const rollTag = /(\[ROLL\])(.[^\[]*)\[\/ROLL\]/gm;
    const formula = html.replace(rollTag, function (content) {
      content = content.replace(rollTag, `$2`);
      const args = content.split(",").map(function (arg) {
        return arg.trim();
      });
      const di = "[DI]";
      let difficulty = "";
      switch (args[1]) {
        case "0":
          difficulty = "Simple";
          break;
        case "1":
          difficulty = "Easy";
          break;
        case "2":
          difficulty = "Average";
          break;
        case "3":
          difficulty = "Hard";
          break;
        case "4":
          difficulty = "Daunting";
          break;
        case "5":
          difficulty = "Formidable";
          break;
      }
      let formula = `<span class="rollable rollSkillDirect" data-skill="${args[0]}" data-difficulty="${args[1]}" data-actor-id="${actorData._id}"><strong>${difficulty} (${di.repeat(args[1])}) ${args[0]}</strong></span>`;
      return formula;
    });

    return formula;
  }
}
