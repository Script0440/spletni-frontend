import React, { useState } from 'react';
import styled from 'styled-components';
import { BeanHead } from 'beanheads';
import Button from './Button';
import { renderToStaticMarkup } from 'react-dom/server';
import { useUser } from '../hooks/useUser';
import { useTheme } from '../hooks/useTheme';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';

// Стили для контейнера аватара
const StyledAvatarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  align-items: center;
  gap: 20px;
  flex-direction: column;
`;

// Стили для контейнера опций
const StyledOptionsContainer = styled.div`
  border-top: 2px solid ${({ theme }) => theme.color};
  display: flex;
  width: calc(100% + 12px);
  height: max-content;
  flex-direction: column;
  overflow-y: scroll;
  overflow-x: hidden;
  ul {
    margin: 20px;
    list-style-type: none;
    h2 {
      margin: 0 auto;
    }
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    ul {
      border: none;
      flex-wrap: wrap;
      flex-direction: row;
    }
    gap: 20px;
  }
`;

const Title = styled.div`
  display: flex;
  align-self: flex-start;
  align-items: center;
  ul {
    display: flex;
  }
`;

const ColorPickButton = styled.button`
  width: 20px;
  border: none;
  cursor: pointer;
  height: 20px;
  background-color: ${({ color }) => color};
  border-radius: 100%;
`;

const Avatar = styled.div`
  display: flex;
  gap: 20px;
`;

const Filter = styled.ul`
  display: flex;
  align-self: center;
  flex-direction: row !important;
  gap: 20px;
`;

// Стили для слайдера
const SliderContainer = styled.div`
  position: relative;
  width: 300px;
  height: 200px;
  margin: 0 auto;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.background || '#f0f0f0'};
`;

const SliderButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: 1px solid ${({ theme }) => theme.color};
  border-color: ${({ theme }) => theme.color};
  color: ${({ theme }) => theme.accentColor};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: background-color 0.3s;

  &:hover {
    color: #fff;
    background-color: ${({ theme }) => theme.accentColor};
  }
`;

const PrevButton = styled(SliderButton)`
  left: 10px;
`;

const NextButton = styled(SliderButton)`
  right: 10px;
`;

const SliderTitle = styled.h3`
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  font-size: 16px;
  color: ${({ theme }) => theme.color};
`;

const Slider = ({ state, options, onChange }) => {
  const { themeObject } = useTheme();
  // Initialize currentIndex based on the current state value
  const [currentIndex, setCurrentIndex] = useState(() => {
    const currentValue = state[options.key];
    const index = options.list.indexOf(currentValue);
    return index !== -1 ? index : 0;
  });

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev === 0 ? options.list.length - 1 : prev - 1;
      onChange(options.key, options.list[newIndex]); // Update state on slide change
      return newIndex;
    });
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev === options.list.length - 1 ? 0 : prev + 1;
      onChange(options.key, options.list[newIndex]); // Update state on slide change
      return newIndex;
    });
  };

  const currentValue = options.list[currentIndex];

  return (
    <SliderContainer theme={themeObject}>
      <SliderTitle theme={themeObject}>{options.title}</SliderTitle>
      <BeanHead {...state} {...{ [options.key]: currentValue }} style={{ width: 100, height: 100 }} />
      <PrevButton theme={themeObject} onClick={prevSlide}>
        <IoIosArrowBack />
      </PrevButton>
      <NextButton theme={themeObject} onClick={nextSlide}>
        <IoIosArrowForward />
      </NextButton>
    </SliderContainer>
  );
};

const CreateAvatar = () => {
  const { updateUser } = useUser();
  const { themeObject } = useTheme();
  const [state, setState] = useState({
    accessory: 'none',
    body: 'chest',
    clothing: 'tankTop',
    clothingColor: 'red',
    eyebrows: 'raised',
    eyes: 'simple',
    faceMask: true,
    faceMaskColor: 'blue',
    facialHair: 'none',
    graphic: 'vue',
    hair: 'bun',
    hairColor: 'white',
    hat: 'none',
    hatColor: 'black',
    lashes: false,
    lipColor: 'green',
    mask: true,
    mouth: 'open',
    skinTone: 'light',
  });
  const [filter, setFilter] = useState('head');

  const headOptions = {
    eyebrows: { key: 'eyebrows', title: 'Brows', list: ['raised', 'leftLowered', 'serious', 'angry', 'concerned'] },
    eyes: { key: 'eyes', title: 'Eyes', list: ['normal', 'leftTwitch', 'happy', 'content', 'squint', 'simple', 'dizzy', 'wink', 'heart'] },
    facialHair: { key: 'facialHair', title: 'Beard', list: ['none', 'stubble', 'mediumBeard'] },
    hair: {
      key: 'hair',
      title: 'Hair',
      colorsType: 'hairColor',
      colors: [
        { tone: 'rgb(254, 220, 88)', name: 'blonde' },
        { tone: 'rgb(217, 110, 39)', name: 'orange' },
        { tone: 'rgb(89, 45, 61)', name: 'black' },
        { tone: 'white', name: 'white' },
        { tone: 'rgb(165, 105, 65)', name: 'brown' },
        { tone: 'rgb(133, 197, 229)', name: 'blue' },
        { tone: 'rgb(214, 154, 199)', name: 'pink' },
      ],
      list: ['none', 'long', 'bun', 'short', 'pixie', 'balding', 'buzz', 'afro', 'bob'],
    },
    lashes: { key: 'lashes', title: 'Lashes', list: [true, false] },
    mouth: {
      key: 'mouth',
      title: 'Mouth',
      colorsType: 'lipColor',
      colors: [
        { tone: 'rgb(214, 112, 112)', name: 'red' },
        { tone: 'rgb(178, 86, 161)', name: 'purple' },
        { tone: 'rgb(198, 131, 180)', name: 'pink' },
        { tone: 'rgb(92, 203, 241)', name: 'turqoise' },
        { tone: 'rgb(60, 160, 71)', name: 'green' },
      ],
      list: ['grin', 'sad', 'openSmile', 'lips', 'open', 'serious', 'tongue'],
    },
  };

  const bodyOptions = {
    body: { key: 'body', title: 'Body', list: ['chest', 'breasts'] },
    clothing: {
      key: 'clothing',
      title: 'Clothing',
      colorsType: 'clothingColor',
      colors: [
        { tone: 'white', name: 'white' },
        { tone: 'rgb(133, 197, 229)', name: 'blue' },
        { tone: 'rgb(99, 55, 73)', name: 'black' },
        { tone: 'rgb(137, 216, 111)', name: 'green' },
        { tone: 'rgb(214, 112, 112)', name: 'red' },
      ],
      list: ['naked', 'shirt', 'dressShirt', 'vneck', 'tankTop', 'dress'],
    },
    graphic: { key: 'graphic', title: 'Graphic', list: ['none', 'redwood', 'gatsby', 'vue', 'react', 'graphQL'] },
    skinTone: { key: 'skinTone', title: 'Skin Tone', list: ['light', 'yellow', 'brown', 'dark', 'red', 'black'] },
  };

  const accessoryOptions = {
    accessory: { key: 'accessory', title: 'Accessory', list: ['none', 'roundGlasses', 'tinyGlasses', 'shades'] },
    faceMask: {
      key: 'faceMask',
      title: 'Face Mask',
      colorsType: 'faceMaskColor',
      colors: [
        { tone: 'white', name: 'white' },
        { tone: 'rgb(214, 112, 112)', name: 'red' },
        { tone: 'rgb(92, 203, 241)', name: 'blue' },
        { tone: 'rgb(60, 160, 71)', name: 'green' },
      ],
      list: [false, true],
    },
    hat: {
      key: 'hat',
      title: 'Hat',
      colorsType: 'hatColor',
      colors: [
        { tone: 'white', name: 'white' },
        { tone: 'rgb(133, 197, 229)', name: 'blue' },
        { tone: 'rgb(89, 45, 61)', name: 'black' },
        { tone: 'rgb(137, 216, 111)', name: 'green' },
        { tone: 'rgb(214, 112, 112)', name: 'red' },
      ],
      list: ['none', 'beanie', 'turban'],
    },
  };

  const allOptions = { ...headOptions, ...bodyOptions, ...accessoryOptions };

  const generateRandomAvatar = () => {
    const newAvatar = {};
    for (const key in allOptions) {
      const { list, colors, colorsType } = allOptions[key];
      newAvatar[key] = list[Math.floor(Math.random() * list.length)];
      if (colorsType && colors) {
        newAvatar[colorsType] = colors[Math.floor(Math.random() * colors.length)].name;
      }
    }
    setState(newAvatar);
  };

  const generateBeanHeadImage = async (state) => {
    const svgString = renderToStaticMarkup(<BeanHead {...state} />);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const file = new File([blob], 'beanhead-avatar.svg', { type: 'image/svg+xml' });

    const formData = new FormData();
    formData.append('avatar', file);
    formData.append('updates', JSON.stringify({}));
    await updateUser(formData);
  };

  const handleChange = (key, value) => {
    setState((prev) => {
      const newState = { ...prev, [key]: value };
      const option = allOptions[key];
      if (option?.colorsType) {
        const validColors = option.colors.map((c) => c.name);
        if (!validColors.includes(newState[option.colorsType])) {
          newState[option.colorsType] = validColors[0];
        }
      }
      return newState;
    });
  };

  const renderOptions = (options) =>
    Object.entries(options).map(([key, values]) => (
      <ul key={key}>
        <Title>
          <h2>{values.title}</h2>
          <ul>
            {values.colors &&
              values.colors.map((c) => (
                <ColorPickButton
                  onClick={() => handleChange(values.colorsType, c.name)}
                  color={c.tone}
                  key={c.name}
                />
              ))}
          </ul>
        </Title>
        <Slider state={state} options={values} onChange={handleChange} />
      </ul>
    ));

  return (
    <StyledAvatarContainer>
      <Avatar>
        <BeanHead style={{ width: 120, height: 120 }} {...state} />
        <Button onClick={() => generateBeanHeadImage(state)}>Save</Button>
        <Button onClick={generateRandomAvatar}>Random</Button>
      </Avatar>
      <Filter>
        <li>
          <Button onClick={() => setFilter('head')}>Head</Button>
        </li>
        <li>
          <Button onClick={() => setFilter('body')}>Body</Button>
        </li>
        <li>
          <Button onClick={() => setFilter('accessory')}>Accessory</Button>
        </li>
      </Filter>
      <StyledOptionsContainer theme={themeObject}>
        {filter === 'head' && renderOptions(headOptions)}
        {filter === 'body' && renderOptions(bodyOptions)}
        {filter === 'accessory' && renderOptions(accessoryOptions)}
      </StyledOptionsContainer>
    </StyledAvatarContainer>
  );
};

export default CreateAvatar;