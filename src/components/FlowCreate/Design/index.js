import React from "react";
import PropTypes from "prop-types";
import Block from "~/components/FlowCreateBlock";
import DesignIcon from "public/images/icons/design.inline.svg";
import CustomSelect from "~/components/CustomSelect";
import dynamic from "next/dynamic";

const ColorPicker = dynamic(() => import("~/components/ColorPicker"), {
  ssr: false,
});

const DesignBlock = ({ colors, setColors }) => {
  const handleColorChange = (color, name = "undefined") => {
    setColors((prevState) => ({ ...prevState, [name]: color }));
  };
  return (
    <Block title={"Design"} icon={DesignIcon}>
      <div className={"mb-5 grid grid-cols-1 gap-5 md:grid-cols-2"}>
        <ColorPicker
          label={"Primary Button Color"}
          name={"buttonColor"}
          onChange={handleColorChange}
          defaultValue={colors.buttonColor}
        />
        <ColorPicker
          label={"Select Button text color"}
          name={"buttonTextColor"}
          onChange={handleColorChange}
          defaultValue={colors.buttonTextColor}
        />
        <ColorPicker
          label={"Accept Button text color"}
          name={"acceptButtonTextColor"}
          onChange={handleColorChange}
          defaultValue={colors.acceptButtonTextColor}
        />
        <ColorPicker
          label={"Wrong answer button text  color"}
          name={"wrongAnswerButtonTextColor"}
          onChange={handleColorChange}
          defaultValue={colors.wrongAnswerButtonTextColor}
        />
        <ColorPicker
          label={"Main title color"}
          name={"mainTitleColor"}
          onChange={handleColorChange}
          defaultValue={colors.mainTitleColor}
        />
        <ColorPicker
          label={"Description text color"}
          name={"descriptionTextColor"}
          onChange={handleColorChange}
          defaultValue={colors.descriptionTextColor}
        />
        <ColorPicker
          label={"Subtitle text color"}
          name={"subtitleTextColor"}
          onChange={handleColorChange}
          defaultValue={colors.subtitleTextColor}
        />
        <ColorPicker
          label={"Survey Options Color"}
          name={"surveyOptionsColor"}
          onChange={handleColorChange}
          defaultValue={colors.surveyOptionsColor}
        />
        <ColorPicker
          label={"Survey box color"}
          name={"surveyBoxColor"}
          onChange={handleColorChange}
          defaultValue={colors.surveyBoxColor}
        />
      </div>
      {/*<div className={'mb-5'}>*/}
      {/*  <CustomSelect*/}
      {/*    label={'Typography (Google Fonts)Typography (Google Fonts)'}*/}
      {/*  >*/}
      {/*    <option value="a">Inter</option>*/}
      {/*  </CustomSelect>*/}
      {/*</div>*/}
    </Block>
  );
};

DesignBlock.propTypes = {
  colors: PropTypes.object.isRequired,
  setColors: PropTypes.func.isRequired,
};

export default DesignBlock;
